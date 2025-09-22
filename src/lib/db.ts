// DEV ONLY – disable TLS verification on Windows/corp networks
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Client } from "pg";

// Use pooled connection string from .env.local
export async function pg() {
  const dsn = process.env.PG_CONNECTION_STRING;
  if (!dsn) throw new Error("PG_CONNECTION_STRING missing");

  const client = new Client({
    connectionString: dsn,
    ssl: { require: true, rejectUnauthorized: false },
  });

  try {
    await client.connect();
    return client;
  } catch (e: any) {
    throw new Error("PG connect failed: " + (e?.message || String(e)));
  }
}
