"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createGroup(name: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", data: null };
  }
  
  try {
    if (!name || name.trim() === "") {
      throw new Error("Group name is required");
    }
    
    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        userGroups: {
          create: {
            userId: session.user.id
          }
        }
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
