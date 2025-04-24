"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/auth";

// Get all chores for a group
export async function getChoresForGroup(groupId: string) {
  try {
    const id = parseInt(groupId);
    
    if (isNaN(id)) {
      throw new Error("Invalid group ID");
    }
    
    const chores = await prisma.chore.findMany({
      where: { groupId: id },
      orderBy: { name: 'asc' }
    });
    
    return { success: true, data: chores };
  } catch (error) {
    console.error("Error fetching chores:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch chores" 
    };
  }
}

// Log a completed chore
export async function logChore(choreId: number,  groupId: number) {
  const session = await auth()
  try {
    const userId = session?.user?.id 
    if (!userId) {
      throw new Error("User not authenticated");
    }
    // Validate inputs
    if (isNaN(choreId) || isNaN(groupId)) {
      throw new Error("Invalid input parameters");
    }
    
    // Check if chore exists
    const chore = await prisma.chore.findUnique({
      where: { id: choreId }
    });
    
    if (!chore) {
      throw new Error("Chore not found");
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Create chore log entry
    const choreLog = await prisma.choreLog.create({
      data: {
        choreId,
        userId,
        groupId
      }
    });
    
    return { success: true, data: choreLog };
  } catch (error) {
    console.error("Error logging chore:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to log chore" 
    };
  }
}

// Get recent chore logs for a group
export async function getRecentChoreLogs(groupId: string, limit: number = 10) {
  try {
    const id = parseInt(groupId);
    
    if (isNaN(id)) {
      throw new Error("Invalid group ID");
    }
    
    const choreLogs = await prisma.choreLog.findMany({
      where: { groupId: id },
      include: {
        chore: true,
        user: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    
    return { success: true, data: choreLogs };
  } catch (error) {
    console.error("Error fetching chore logs:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch chore logs" 
    };
  }
}
