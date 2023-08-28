import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { NWProvider } from "@/context";
import { getChain, getClient } from "@/client";

const montserrat = Montserrat({ subsets: ["cyrillic"] });

const themeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  fonts: {
    montserrat: montserrat.style.fontFamily,
    heading: montserrat.style.fontFamily,
    body: montserrat.style.fontFamily,
  },
  colors: {
    "nw-yellow": "#ffc107",
    button: {
      header: {
        default: "#2A2B2D",
        active: "#DFDFDF",
        hover: "#DFDFDF",
        disabled: "#2A2B2D75",
        text: {
          default: "#EEEEEE",
          active: "#000000",
          hover: "#000000",
          disabled: "#EEEEEE",
        },
      },
    },
  },
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "1920px",
  },
  fontSizes: {
    "nw-2xs": "0.7rem",
    "nw-xs": "1rem",
    "nw-sm": "1.2rem",
    "nw-md": "1.5rem",
    "nw-lg": "1.875rem",
    "nw-xl": "2rem",
    "nw-2xl": "3rem",
    "nw-3xl": "4rem",
  },
  styles: {
    global: {
      body: {
        backgroundColor: "#121212",
      },
    },
  },
};
const theme = extendTheme(themeConfig);

// Choose which chains you'd like to show
const chains = [getChain()];
const config = createConfig(
  getDefaultConfig({
    publicClient: getClient(),
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    appName: "Night Watch",
    appDescription: "Night Watch NFT Project",
    appUrl: "https://impossibletrios.art",
    appIcon: "https://i.imgur.com/lLIRfyy.jpg",

    chains,
  }),
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <ChakraProvider theme={theme}>
          <NWProvider>
            <Component {...pageProps} />
          </NWProvider>
        </ChakraProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
