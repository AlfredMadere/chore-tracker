"use server";

import prisma from "@/lib/prisma";

export async function createGroup(name: string) {
  try {
    if (!name || name.trim() === "") {
      throw new Error("Group name is required");
    }
    
    const group = await prisma.group.create({
      data: {
        name: name.trim()
      }
    });
    
    return { success: true, data: group };
  } catch (error) {
    console.error("Error creating group:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create group" 
    };
  }
}
