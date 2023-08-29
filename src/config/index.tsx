import { Hex } from "viem";

export const config = {
  addresses: {
    nightWatch: "0x3389D3b8eD9F863e8F55Bdf3A5efc5e01c5DbCC2" as Hex,
    vendor: "0xAEf87124dC2784BC4cE21dBc852F6FD293df8E6b" as Hex,
    vault: "0x93cb7A0238B25679b6389719AfD6D91FC4c855ac" as Hex,
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
  minLookupBlock: 4184266,
};
