import Head from "next/head";
import { GridItem, Grid, useMediaQuery, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import LeftPanel from "@/components/left-panel";
import RightPanel from "@/components/right-panel";
import MobilePanel from "@/components/mobile-panel";
import { usePurchase } from "@/hooks/usePurchase";
import { useIsMounted } from "@/hooks/useIsMounted";
import ErrorHandler from "@/components/error-handler";
import { useClaim } from "@/hooks/useClaim";

export default function Home() {
  const isMounted = useIsMounted();
  const [isDesktop] = useMediaQuery("(min-width: 992px)");
  const { purchaseCompleted } = usePurchase();
  const { claimCompleted } = useClaim();

  // Browser light mode or dark mode
  const [isLightMode] = useMediaQuery("(prefers-color-scheme: light)");
  const colorMode = isLightMode ? "light" : "dark";

  useEffect(() => {
    if (claimCompleted && !isDesktop) {
      const target = document.getElementById("mobile-panel") as HTMLElement;
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isDesktop, claimCompleted]);

  return (
    <>
      <Head>
        <title>Buy Night Watch - Impossible Trios</title>
        <meta name="title" content="Buy Night Watch - Impossible Trios" />
        <meta
          name="description"
          content="Night Watch is an experimental and unique art collection with an on-chain game."
        />
        <meta
          name="keywords"
          content="NFT, Art, Game, Night Watch, On-chain game, art collection, deflationary"
        />

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={"/favicon/" + colorMode + "/apple-touch-icon.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={"/favicon/" + colorMode + "/favicon-32x32.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={"/favicon/" + colorMode + "/favicon-16x16.png"}
        />
        <link rel="icon" href={"/favicon/" + colorMode + "/favicon.ico"} />
        <link
          rel="manifest"
          href={"/favicon/" + colorMode + "/site.webmanifest"}
        />

        {/* SEO */}
        <meta property="og:title" content="Night Watch - Impossible Trios" />
        <meta property="og:image" content="https://i.imgur.com/lLIRfyy.jpg" />
        <meta
          property="og:description"
          content="Night Watch is an experimental and unique art collection with an on-chain game."
        />
        <meta property="og:url" content="https://impossibletrios.art" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://impossibletrios.art" />
        <meta name="twitter:title" content="Night Watch - Impossible Trios" />
        <meta
          name="twitter:description"
          content="Night Watch is an experimental and unique art collection with an on-chain game."
        />
        <meta name="twitter:image" content="https://i.imgur.com/lLIRfyy.jpg" />
        <meta
          name="twitter:image:src"
          content="https://i.imgur.com/lLIRfyy.jpg"
        />
        <meta name="twitter:site" content="@nightwatchwalks" />
      </Head>
      <main>
        {isMounted && (
          <>
            {isDesktop ? (
              <Grid
                templateColumns={[
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                ]}
              >
                <GridItem bg={"black"} colSpan={1}>
                  <LeftPanel />
                </GridItem>
                <GridItem colSpan={[1, 1, 1, 2]}>
                  <RightPanel />
                </GridItem>
              </Grid>
            ) : (
              <Flex flexDir={"column"} justify={"center"}>
                <LeftPanel id={"main-panel"} bg={"black"} />
                {purchaseCompleted && (
                  <MobilePanel id={"mobile-panel"} bg={"black"} />
                )}
              </Flex>
            )}
          </>
        )}
        <ErrorHandler />
      </main>
    </>
  );
}
