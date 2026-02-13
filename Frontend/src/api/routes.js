import client from "./client";

export async function calculateRoute(payload) {
  const { data } = await client.post("/route", payload);
  return data;
}

export async function calculateMultipleRoutes(payload) {
  const { data } = await client.post("/routes/multiple", payload);
  return data;
}

