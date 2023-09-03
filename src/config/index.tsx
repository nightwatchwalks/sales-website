import { Hex } from "viem";

export const config = {
  addresses: {
    nightWatch: "0xEf0b00d38eED201733F2AA6328e5f56891A57BB2" as Hex,
    vendor: "0xD1C833b46266CcF6060e90B69161FCEe9C66E826" as Hex,
    vault: "0x96e4fe738f991AfAeF7B1e55eaB5B528D3C73d60" as Hex,
  },
  apis: {
    walletConnect: "3589d86efd1ff44bc46d3659de3e0c90",
  },
  metadataServerRoot: "https://metadata-server.impossibletrios.art",
  generatedGifsRoot:
    "https://night-watch-walks.s3.us-east-1.amazonaws.com/generated-gifs",
  rpcUrl: "https://mainnet.infura.io/v3/b3bb49d22cc24fd08a1fe28db11768a1",
  pricePerToken: 0.03,
  chainId: 1,
  minLookupBlock: 18024804,
  assetsUrl:
    "https://night-watch-walks.s3.amazonaws.com/web-assets/sale-website",
};
