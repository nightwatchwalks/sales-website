import type { NextApiRequest, NextApiResponse } from "next";

// Setup cache
let lastUpdate: number;
let data: any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // If cache is not set or is older than 60 minutes, update cache
    if (!lastUpdate || Date.now() - lastUpdate > 1000 * 60 * 60) {
      lastUpdate = Date.now();
      data = await updateMappings();
    }
  } catch (e: any) {
    console.error("Error while updating mappings", e.message);
    return res.status(500).json({ error: e.message });
  }
  return res.status(200).json(data);
}

async function updateMappings() {
  const mappingsUrl = process.env.MAPPINGS_JSON_URL as unknown as URL;

  const mappingsRes = await fetch(mappingsUrl);
  if (!mappingsRes.ok) {
    throw new Error("Failed to fetch mappings");
  }
  const mappingsJson = await mappingsRes.json();
  return mappingsJson;
}
