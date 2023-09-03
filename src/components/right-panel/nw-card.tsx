import { config } from "@/config";
import { useSelectedToken } from "@/hooks/useSelectedToken";
import { Box, Image } from "@chakra-ui/react";
import { useMemo } from "react";

export default function NWCard({ token, ...props }) {
  const { selectedToken, setSelectedToken } = useSelectedToken();

  const tokenImage = useMemo(() => {
    return config.metadataServerRoot + "/getImage/" + token.id;
  }, [token]);

  return (
    <Box
      minW={"40px"}
      minH={"30px"}
      maxW={"140px"}
      onClick={() => setSelectedToken(token)}
      {...props}
    >
      <Image
        border={
          (selectedToken === token ? "1px" : "1px") +
          " solid " +
          (selectedToken === token ? "white" : "rgba(65, 65, 65, 1)")
        }
        boxShadow={"0px 0px 10px 0px rgba(0, 0, 0, 0.75)"}
        src={tokenImage}
        alt={"Night Watch"}
        onClick={() => setSelectedToken(token)}
        fallbackSrc={config.assetsUrl + "/images/loading.gif"}
      />
    </Box>
  );
}
