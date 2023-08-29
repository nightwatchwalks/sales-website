import { Hex } from "viem";

export const config = {
  addresses: {
    nightWatch: "0x1f508DcB7C3eD18c967df3b20A1567e2429825e9" as Hex,
    vendor: "0x14424BdB8426e7fb9F77557c30C8edBA746454f2" as Hex,
    vault: "0x9C28c036406F87fcC236898b6ED90CBe0BEa91C5" as Hex,
  },
  apis: {
    walletConnect: "3589d86efd1ff44bc46d3659de3e0c90",
  },
  metadataServerRoot: "https://metadata-server.impossibletrios.art",
  generatedGifsRoot:
    "https://night-watch-walks.s3.us-east-1.amazonaws.com/generated-gifs",
  rpcUrl: "https://sepolia.infura.io/v3/b3bb49d22cc24fd08a1fe28db11768a1",
  pricePerToken: 0.03,
  chainId: 11155111,
  minLookupBlock: 4184381,
};
