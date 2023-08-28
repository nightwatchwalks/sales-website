import { getClient } from "@/client";
import { config } from "@/config";
import type { NextApiRequest, NextApiResponse } from "next";
import nwAbi from "../../../abi/NightWatch.abi.json";

// Get contract addresses from environment variables
const nightWatchContract = config.addresses.nightWatch;

// Setup cache
let lastUpdate: number;
let data: {
  totalMerged: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // If cache is not set or is older than 6 seconds, update cache
    if (!lastUpdate || Date.now() - lastUpdate > 6000) {
      lastUpdate = Date.now();
      data = await updateTotalMerged();
    }
    return res.status(200).json(data);
  } catch (e: any) {
    console.error("Error while fetching total merged", e);
    return res.status(500).json({ error: e.message });
  }
}

async function updateTotalMerged() {
  const client = getClient();

  // Get total merged
  const totalMerged = await client.readContract({
    address: nightWatchContract,
    functionName: "totalMergeCount",
    abi: nwAbi,
  });

  // Prepare token data response
  const resObj = {
    totalMerged: Number(totalMerged),
  };

  return resObj;
}
