import { NWContext } from "@/context";
import { Token } from "@/types";
import { useContext, useMemo, useState } from "react";

export interface useSelectedTokenType {
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;
}

export function useSelectedTokenCtx(): useSelectedTokenType {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  return {
    selectedToken,
    setSelectedToken,
  };
}

export function useSelectedToken() {
  const { useSelectedToken } = useContext(NWContext);

  if (!useSelectedToken) {
    throw new Error("You can't use useSelectedToken outside of NWProvider");
  }

  return useSelectedToken;
}
