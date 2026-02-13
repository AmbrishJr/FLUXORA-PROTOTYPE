import client from "./client";

export async function getHeatmap() {
  const { data } = await client.get("/heatmap");
  return data;
}

