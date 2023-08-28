import { NWContext } from "@/context";
import { useInterval } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";

export interface useTotalMergedType {
  totalMerged: number;
  loading: boolean;
}

export function useTotalMergedCtx(): useTotalMergedType {
  const [totalMerged, setTotalMerged] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalMerged = async () => {
    setLoading(true);
    let res;
    try {
      res = await fetch(`/api/totalMerged`);
      if (!res.ok) {
        console.error("Error while fetching total merged.", res);
        setLoading(false);
        return;
      }
      const { totalMerged } = await res.json();
      setTotalMerged(totalMerged);
    } catch (e) {
      console.error("Error while fetching total merged", e);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  useInterval(() => {
    fetchTotalMerged();
  }, 5000);

  useEffect(() => {
    fetchTotalMerged();
  }, []);

  return {
    totalMerged,
    loading,
  };
}

export function useTotalMerged() {
  const { useTotalMerged } = useContext(NWContext);

  if (!useTotalMerged) {
    throw new Error("You can't use useTotalMerged outside of NWProvider");
  }

  return useTotalMerged;
}
