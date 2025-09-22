import { NextResponse } from "next/server";

export async function GET() {
  const dsn = process.env.PG_CONNECTION_STRING || "";
  // mask password
  const masked = dsn.replace(/:\/\/(.*?):(.*?)@/, (_m, u) => `://${u}:***@`);
  // pull host
  const host = dsn.split("@")[1]?.split("/")[0] || "";
  return NextResponse.json({ ok: true, dsn: masked, host });
}
