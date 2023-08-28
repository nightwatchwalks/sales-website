import {
  BlockNotFoundError,
  GetBlockReturnType,
  Hex,
  createWalletClient,
  encodePacked,
  hexToNumber,
  http,
  isAddress,
  toBytes,
} from "viem";
import { config } from "@/config";
import { getClient } from "@/client";
import type { NextApiRequest, NextApiResponse } from "next";
import applyRateLimit from "../../utils/rate-limit";
import nwVendorAbi from "../../../abi/NightWatchVendor.abi.json";
import { privateKeyToAccount } from "viem/accounts";
import seedrandom from "seedrandom";
import * as redis from "redis";

if (!process.env.SIGNER_PRIVATE_KEY) {
  throw new Error("SIGNER_PRIVATE_KEY is not set");
}

if (!process.env.SIGNER_PRIVATE_KEY.startsWith("0x")) {
  throw new Error("SIGNER_PRIVATE_KEY is not a valid hex string");
}

if (!process.env.REDIS_ENDPOINT) {
  throw new Error("REDIS_ENDPOINT is not set");
}

const redisClient = redis.createClient({
  url: process.env.REDIS_ENDPOINT,
});

try {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
} catch (e) {
  console.error("Failed to connect to Redis", e);
  throw e;
}

process.on("exit", () => {
  redisClient.quit(); // gracefully shutdown the Redis connection
});

// Get contract addresses from environment variables
const nightWatchVendorContract = config.addresses.vendor;

const localCache: {
  lastUpdateLatestBlockFetched: number;
  latestBlockFetched: string | null;
  lastUpdateEvents: number;
  events: string | null;
} = {
  lastUpdateLatestBlockFetched: 0,
  latestBlockFetched: null,
  lastUpdateEvents: 0,
  events: null,
};

const cachedBlocks = new Map<number, GetBlockReturnType>();

const logDebug = true;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  if (!req.query.receiver || !isAddress(req.query.receiver as string)) {
    return res.status(400).json({ message: "Receiver address is required" });
  }

  if (req.query.block && isNaN(Number(req.query.block))) {
    return res.status(400).json({ message: "Block number is invalid" });
  }

  const receiver = req.query.receiver as Hex;
  const requestedBlock = Number(req.query.block);

  const client = getClient();

  // Check if receiver has unclaimed tokens
  if (logDebug) {
    console.log("Checking if receiver has unclaimed tokens");
  }

  const unclaimedTokenCount = await client.readContract({
    address: nightWatchVendorContract,
    functionName: "_unclaimedTokens",
    abi: nwVendorAbi,
    args: [receiver],
  });

  if (unclaimedTokenCount === 0n) {
    return res.status(400).json({ message: "No tokens to claim" });
  }

  try {
    if (!redisClient.isOpen) {
      if (logDebug) console.log("Connecting to Redis");
      await redisClient.connect();
    }
  } catch (e) {
    console.error("Failed to connect to Redis", e);
    return res.status(500).json({ message: "Internal server error" });
  }

  let currentBlock: number;
  try {
    if (logDebug) console.log("Getting current block number");
    currentBlock = Number(await client.getBlockNumber());
  } catch (e) {
    console.error("Error retrieving block number", e);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (requestedBlock && requestedBlock > currentBlock + 3) {
    return res.status(400).json({
      message: `Requested block number is too far in the future. Current block number is ${currentBlock}`,
    });
  }

  if (requestedBlock) {
    if (logDebug) console.log("Waiting for requested block to be mined");
    while (requestedBlock > currentBlock) {
      await delay(1000);
      try {
        currentBlock = Number(await client.getBlockNumber());
      } catch (e) {
        console.error("Error retrieving block number", e);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  let latestEvents: {
    purchaseEvents: PurchaseEvent[];
    transferEvents: TransferEvent[];
    claimEvents: ClaimEvent[];
  };
  let unclaimedTokens: number[];
  let retries = 0;

  do {
    try {
      if (logDebug) console.log("Fetching events");
      latestEvents = await fetchEvents(requestedBlock);
    } catch (e) {
      console.error("Error while fetching events", e);
      return res.status(500).json({ message: "Internal server error" });
    }
    // Get last unclaimed tokens for receiver
    try {
      if (logDebug) console.log("Getting last unclaimed tokens");
      const time = Date.now();
      unclaimedTokens = (
        await getLastUnclaimedTokensForReceiver(receiver, latestEvents)
      ).map((t) => Number(t));
      if (unclaimedTokenCount != unclaimedTokens.length) {
        console.error(
          `Error while getting the last unclaimed tokens. Expected ${unclaimedTokenCount} tokens, got ${unclaimedTokens.length}`,
        );
        return res.status(500).json({ message: "Internal server error" });
      }

      if (logDebug) {
        console.log(
          `Got last unclaimed tokens in ${Date.now() - time}ms`,
          unclaimedTokens,
        );
      }
    } catch (e) {
      console.error("Error while getting the last unclaimed tokens", e);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (++retries >= 5) {
      break;
    }
    await delay(1000);
  } while (!unclaimedTokens || unclaimedTokens.length === 0);

  if (!unclaimedTokens || unclaimedTokens.length === 0) {
    console.error(
      "Error while getting the last unclaimed tokens. Unclaimed tokens array length is 0.",
    );
    return res.status(500).json({ message: "Internal server error" });
  }

  // Prepare message to sign
  const message = encodePacked(
    ["uint16[]", "address"],
    [unclaimedTokens, receiver],
  );

  let signature: Hex;

  try {
    // Sign message
    const walletClient = createWalletClient({
      transport: http(config.rpcUrl),
    });

    const account = privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY as Hex);

    signature = await walletClient.signMessage({
      account,
      message: { raw: toBytes(message) },
    });
  } catch (e: any) {
    console.error("Error while providing signature", e);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    return res.status(200).json({
      signature,
      tokens: unclaimedTokens,
      transactionHash: latestEvents.purchaseEvents.findLast(
        (log) => log.args.receiver === receiver,
      )?.transactionHash,
    });
  } catch (e: any) {
    console.error("Error while getting the tokens", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchEvents(requestedBlock: number) {
  let tries = 0;

  while (tries < 30) {
    tries++;

    let latestBlock: string | null;
    try {
      if (
        tries === 1 &&
        localCache.lastUpdateLatestBlockFetched &&
        Date.now() - localCache.lastUpdateLatestBlockFetched < 10000
      ) {
        latestBlock = localCache.latestBlockFetched;
      } else {
        latestBlock = await redisClient.get("eventStorage_latestBlockFetched");
        localCache.latestBlockFetched = latestBlock;
        localCache.lastUpdateLatestBlockFetched = Date.now();
      }
    } catch (e) {
      console.error(
        "Error while getting the latest block fetched from Redis",
        e,
      );
      throw e;
    }

    if (latestBlock != null) {
      if (!requestedBlock || Number(latestBlock) >= requestedBlock) {
        let events: string | null;
        try {
          if (
            tries === 1 &&
            localCache.lastUpdateEvents &&
            Date.now() - localCache.lastUpdateEvents < 10000
          ) {
            events = localCache.events;
          } else {
            events = await redisClient.get("eventStorage_events");
            localCache.events = events;
            localCache.lastUpdateEvents = Date.now();
          }
        } catch (e) {
          console.error("Error while getting the events from Redis", e);
          throw e;
        }

        if (events) {
          let eventsJson: {
            purchaseEvents: PurchaseEvent[];
            transferEvents: TransferEvent[];
            claimEvents: ClaimEvent[];
          };

          try {
            eventsJson = JSON.parse(events);
          } catch (e) {
            console.error("Error while parsing the events from Redis", e);
            throw e;
          }

          const sorter = (a: Event, b: Event) => {
            if (a.blockNumber === b.blockNumber) {
              return Number(a.transactionIndex) - Number(b.transactionIndex);
            }
            return Number(a.blockNumber) - Number(b.blockNumber);
          };

          eventsJson.purchaseEvents.sort(sorter);
          eventsJson.transferEvents.sort(sorter);
          eventsJson.claimEvents.sort(sorter);

          return eventsJson;
        }
      }
    }

    console.log("Waiting for events to be fetched");
    await delay(2000);
  }

  throw new Error("Could not fetch events after 30 tries.");
}

interface TransferEvent extends Event {
  args: {
    to: Hex;
    from: Hex;
    tokenId: string;
  };
}

interface PurchaseEvent extends Event {
  args: {
    receiver: Hex;
    amount: string;
  };
}

interface ClaimEvent extends Event {
  args: {
    tokens: number[];
  };
}

interface Event {
  blockNumber: string;
  transactionHash: string;
  transactionIndex: number;
}

async function getLastUnclaimedTokensForReceiver(
  receiver: Hex,
  events: {
    transferEvents: TransferEvent[];
    purchaseEvents: PurchaseEvent[];
    claimEvents: ClaimEvent[];
  },
): Promise<number[]> {
  const client = getClient();
  const transfers: TransferEvent[] = events.transferEvents;
  const purchases: PurchaseEvent[] = events.purchaseEvents;
  const claims: ClaimEvent[] = events.claimEvents;

  const vaultAddress = config.addresses.vault;

  let purchaseLedger: { [key: string]: number[] } = {};

  for (const purchase of purchases) {
    let vaultOwnedTokensAtTimeOfPurchase = new Set<number>();

    // Determine the state of the vault at the time of this purchase
    transfers.forEach((log: TransferEvent) => {
      if (Number(log.blockNumber) <= Number(purchase.blockNumber)) {
        if (log.args.to === vaultAddress) {
          vaultOwnedTokensAtTimeOfPurchase.add(Number(log.args.tokenId));
        } else if (log.args.from === vaultAddress) {
          vaultOwnedTokensAtTimeOfPurchase.delete(Number(log.args.tokenId));
        }
      }
    });

    // Deduct already reserved tokens from previous purchases
    for (const key in purchaseLedger) {
      purchaseLedger[key].forEach((token) => {
        vaultOwnedTokensAtTimeOfPurchase.delete(token);
      });
    }

    let block: GetBlockReturnType | undefined;
    do {
      try {
        if (cachedBlocks.has(Number(purchase.blockNumber) + 1)) {
          block = cachedBlocks.get(Number(purchase.blockNumber) + 1);
        } else {
          block = await client.getBlock({
            blockNumber: BigInt(Number(purchase.blockNumber) + 1),
          });
          cachedBlocks.set(Number(purchase.blockNumber) + 1, block);
        }
      } catch (e) {
        if (e instanceof BlockNotFoundError) {
          console.log("Waiting for block to be mined");
          await delay(1000);
        } else {
          console.error("Error while getting the block", e);
          throw e;
        }
      }
    } while (!block);

    const seed = hexToNumber(block.hash) + purchase.transactionIndex; // Use transaction index for differentiation

    const potentialUnclaimedTokens: number[] = shuffleTokens(
      Array.from(vaultOwnedTokensAtTimeOfPurchase),
      seed,
      Number(purchase.args.amount),
    );

    const compoundKey = `${purchase.blockNumber}-${purchase.transactionIndex}`; // Compound key using block number and transaction index

    purchaseLedger[compoundKey] = potentialUnclaimedTokens;
  }

  // Adjust ledger for claims
  for (const claim of claims) {
    for (const key in purchaseLedger) {
      const [blockNum, txnIndex] = key.split("-"); // Decompose the compound key
      if (Number(blockNum) <= Number(claim.blockNumber)) {
        // Only consider ledger entries before or on the same block of the claim
        for (const tokenId of claim.args.tokens) {
          const index = purchaseLedger[key].indexOf(tokenId);
          if (index !== -1) {
            purchaseLedger[key].splice(index, 1);
          }
        }
      }
    }
  }

  // Find the latest purchase for the receiver and return its unclaimed tokens
  const relevantPurchases: PurchaseEvent[] = purchases.filter(
    (p) => p.args.receiver === receiver,
  );
  if (relevantPurchases.length === 0) return [];

  const latestPurchase: PurchaseEvent =
    relevantPurchases[relevantPurchases.length - 1];
  const compoundKey = `${latestPurchase.blockNumber}-${latestPurchase.transactionIndex}`;
  return purchaseLedger[compoundKey] || [];
}

function shuffleTokens(tokens: any[], seed: number, amount: number): any[] {
  const rng = seedrandom(seed.toString());

  const array: any[] = Array.from(tokens);
  let currentIndex: number = array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array.slice(0, amount);
}
