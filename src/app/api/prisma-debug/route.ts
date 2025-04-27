// src/app/api/debug-prisma/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const EXPECTED_LOCATIONS = [
  path.join(process.cwd(), ".prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"),
  path.join(process.cwd(), "src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"),
  path.join(process.cwd(), ".next/server/libquery_engine-rhel-openssl-3.0.x.so.node"),
];

export const runtime = 'nodejs';  // Force Node runtime to avoid Edge issues

export async function GET(request: Request) {
  // OPTIONAL: Protect in production with a secret key
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  if (process.env.DEBUG_PRISMA_SECRET && secret !== process.env.DEBUG_PRISMA_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const results = await Promise.all(
    EXPECTED_LOCATIONS.map(async (location) => {
      try {
        await fs.access(location);
        return { location, exists: true };
      } catch (e) {
        return { location, exists: false };
      }
    })
  );

  return NextResponse.json({
    results,
    cwd: process.cwd(),
  });
}
