import { NWContext } from "@/context";
import { useInterval } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";

export interface useTotalSoldType {
  totalSold: number;
  loading: boolean;
}

export function useTotalSoldCtx() {
  const [totalSold, setTotalSold] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalSold = async () => {
    setLoading(true);
    let res;
    try {
      res = await fetch(`/api/totalSold`);
      if (!res.ok) {
        console.error("Error while fetching total sold", res);
        setLoading(false);
        return;
      }
      const { totalSold } = await res.json();
      setTotalSold(totalSold);
    } catch (e) {
      console.error("Error while fetching total sold", e);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  useInterval(() => {
    fetchTotalSold();
  }, 5000);

  useEffect(() => {
    fetchTotalSold();
  }, []);

  return {
    totalSold,
    loading,
  };
}

export function useTotalSold() {
  const { useTotalSold } = useContext(NWContext);

  if (!useTotalSold) {
    throw new Error("You can't use useTotalSold outside of NWProvider");
  }

  return useTotalSold;
}
