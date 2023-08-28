import { getClient } from "@/client";
import { config } from "@/config";
import nwVendorAbi from "../../../abi/NightWatchVendor.abi.json";
import type { NextApiRequest, NextApiResponse } from "next";

// Get contract addresses from environment variables
const nightWatchVendorContract = config.addresses.vendor;

// Setup cache
let lastUpdate: number;
let data: {
  totalSold: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // If cache is not set or is older than 1 seconds, update cache
    if (!lastUpdate || Date.now() - lastUpdate > 1000) {
      lastUpdate = Date.now();
      data = await updateTotalSold();
    }

    return res.status(200).json(data);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}

async function updateTotalSold() {
  const client = getClient();

  // Get total sold
  const totalSold = await client.readContract({
    address: nightWatchVendorContract,
    functionName: "_totalSold",
    abi: nwVendorAbi,
  });

  // Prepare token data response
  const resObj = {
    totalSold: Number(totalSold),
  };

  return resObj;
}
