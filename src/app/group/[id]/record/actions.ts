"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure, ActionResult } from "@/lib/utils";
import crypto from "crypto";

// Log a freeform chore
export async function logFreeformChore(
  groupId: number,
  name: string,
  minutes: number,
  description?: string,
  timeWasEdited: boolean = false
): Promise<ActionResult<{ id: number }>> {
  const session = await auth();
  
  try {
    const userId = session?.user?.id;
    
    if (!userId) {
      return failure("User not authenticated");
    }
    
    // Validate inputs
    if (isNaN(groupId)) {
      return failure("Invalid group ID");
    }
    
    if (!name.trim()) {
      return failure("Chore name is required");
    }
    
    if (minutes <= 0) {
      return failure("Time must be greater than 0");
    }
    
    // Verify that the user belongs to the group
    const userGroup = await prisma.userToGroups.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });
    
    if (!userGroup) {
      return failure("You do not have permission to log chores in this group");
    }
    
    // Create a unique name for the freeform chore to avoid conflicts
    // We'll use a UUID suffix that won't be displayed to users
    const uniqueId = crypto.randomUUID();
    const uniqueName = `${name.trim()}__${uniqueId}`;
    
    // Create the freeform chore
    const chore = await prisma.chore.create({
      data: {
        name: uniqueName,
        points: minutes, // Use minutes as points
        description: description || "",
        freeform: true,
        groupId
      }
    });
    
    // Create chore log entry
    const choreLog = await prisma.choreLog.create({
      data: {
        choreId: chore.id,
        userId,
        groupId,
        usedTimer: !timeWasEdited // If time wasn't edited, then timer was used
      }
    });
    
    return success({ id: choreLog.id });
  } catch (error) {
    console.error("Error logging freeform chore:", error);
    return failure(error instanceof Error ? error.message : "Failed to log freeform chore");
  }
}
