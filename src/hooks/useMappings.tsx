import { NWContext } from "@/context";
import { useContext, useEffect, useState } from "react";

export interface useMappingsType {
  mappings: Map<number, string> | undefined;
  loading: boolean;
}

export function useMappingsCtx(): useMappingsType {
  const [mappings, setMappings] = useState<Map<number, string>>();
  const [loading, setLoading] = useState(true);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const mappingsRes = await fetch("/api/getMappings");
      const mappingsJson = await mappingsRes.json();
      if (!mappingsRes.ok) {
        console.error("Error while fetching mappings", mappingsJson);
      } else {
        setMappings(new Map(mappingsJson));
      }
    } catch (e) {
      console.error("Error while fetching mappings", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  return {
    mappings,
    loading,
  };
}

export function useMappings() {
  const { useMappings } = useContext(NWContext);

  if (!useMappings) {
    throw new Error("You can't use useMappings outside of NWProvider");
  }

  return useMappings;
}
