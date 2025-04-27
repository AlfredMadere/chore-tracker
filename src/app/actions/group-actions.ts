"use server";

import { prisma } from "@/lib/prisma";

export async function getGroupCount(): Promise<{count: number, error?: string}> {
  try {
    const count = await prisma.group.count();
    return { count };
  } catch (error) {
    console.error("Error fetching group count:", error instanceof Error ? error.message : String(error));
    return { 
      count: 0, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
