// Export handlers from the auth.ts file
export const runtime = "nodejs";          // <– NEW
export const dynamic = "force-dynamic";   // (optional) avoid static optimisation

import { handlers } from "@/auth";

export const { GET, POST } = handlers;