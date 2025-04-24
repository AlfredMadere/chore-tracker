"use server";

import prisma from "@/lib/prisma";

export async function findGroupBySharingId(sharingId: string) {
  try {
    if (!sharingId || sharingId.trim() === "") {
      return { success: false, error: "Sharing ID is required" };
    }
    
    const group = await prisma.group.findUnique({
      where: { sharingId: sharingId.trim() },
      select: { id: true, name: true }
    });
    
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    
    return { success: true, data: group };
  } catch (error) {
    console.error("Error finding group by sharing ID:", error instanceof Error ? error.message : "Failed to find group");
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to find group" 
    };
  }
}
