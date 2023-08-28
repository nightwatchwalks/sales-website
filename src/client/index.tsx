import { config } from "@/config";
import { createPublicClient, http } from "viem";
import { goerli, mainnet } from "viem/chains";

export const anvilLocalhost = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
} as const;

export function getChain() {
  return config.chainId === 31337
    ? anvilLocalhost
    : config.chainId === 5
    ? goerli
    : mainnet;
}

export function getClient() {
  return createPublicClient({
    chain: getChain(),
    transport: http(config.rpcUrl),
  });
}
