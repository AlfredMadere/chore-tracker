"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure, ActionResult } from "@/lib/utils";

// Get all chores for a group
export async function getChoresForGroup(groupId: string) {
  try {
    const id = parseInt(groupId);
    
    if (isNaN(id)) {
      throw new Error("Invalid group ID");
    }
    
    const chores = await prisma.chore.findMany({
      where: { 
        groupId: id,
        freeform: false // Exclude freeform chores
      },
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

// Delete (unlog) a chore log entry
export async function deleteChoreLog(choreLogId: number): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return failure("User not authenticated");
    }
    
    // Validate input
    if (isNaN(choreLogId)) {
      return failure("Invalid chore log ID");
    }
    
    // Check if the chore log exists
    const choreLog = await prisma.choreLog.findUnique({
      where: { id: choreLogId }
    });
    
    if (!choreLog) {
      return failure("Chore log not found");
    }
    
    // Verify that the user is the one who created the log
    if (choreLog.userId !== userId) {
      return failure("You can only unlog chores that you logged yourself");
    }
    
    // Delete the chore log
    await prisma.choreLog.delete({
      where: { id: choreLogId }
    });
    
    return success(undefined);
  } catch (error) {
    console.error("Error deleting chore log:", error);
    return failure(error instanceof Error ? error.message : "Failed to delete chore log");
  }
}
