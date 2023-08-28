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
  metadataServerRoot: "https://q558ifducp.us-east-1.awsapprunner.com",
  generatedGifsRoot:
    "https://night-watch-walks.s3.us-east-1.amazonaws.com/generated-gifs",
  rpcUrl: "https://goerli.infura.io/v3/a3d34c108b58414799f3c3e49e2f530d",
  pricePerToken: 0.03,
  chainId: 5,
  minLookupBlock: 9572931,
};