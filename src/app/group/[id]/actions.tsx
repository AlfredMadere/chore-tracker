"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { success, failure, ActionResult } from "@/lib/utils";

// Get group by ID with all related data
export async function getGroupById(id: string) {
  try {
    const groupId = parseInt(id);
    
    if (isNaN(groupId)) {
      throw new Error("Invalid group ID");
    }
    
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        userGroups: {
          include: {
            user: true
          }
        },
        Chore: true,
        ChoreLog: {
          include: {
            user: true,
            chore: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    return { success: true, data: group };
  } catch (error) {
    console.error("Error fetching group:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch group" 
    };
  }
}

// Update group name
export async function updateGroupName(id: string, name: string) {
  try {
    const groupId = parseInt(id);
    
    if (isNaN(groupId)) {
      throw new Error("Invalid group ID");
    }
    
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Name is required");
    }
    
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { name: name.trim() }
    });
    
    return { success: true, data: updatedGroup };
  } catch (error) {
    console.error("Error updating group name:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update group name" 
    };
  }
}

// Get points per user for a group
export async function getPointsPerUser(id: string, startDate?: Date, endDate?: Date) {
  try {
    const groupId = parseInt(id);
    
    if (isNaN(groupId)) {
      throw new Error("Invalid group ID");
    }
    
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        userGroups: {
          include: {
            user: true
          }
        },
        ChoreLog: {
          where: startDate && endDate ? {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          } : undefined,
          include: {
            chore: true,
            user: true
          }
        }
      }
    });
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    // Calculate points per user
    const pointsPerUser = group.userGroups.map(userGroup => {
      const userLogs = group.ChoreLog.filter(log => log.userId === userGroup.userId);
      const totalPoints = userLogs.reduce((sum, log) => sum + log.chore.points, 0);
      
      return {
        id: userGroup.userId,
        name: userGroup.user.name || userGroup.user.email.split('@')[0], // Use first part of email if name not available
        points: totalPoints
      };
    });
    
    // Sort by points (highest first)
    pointsPerUser.sort((a, b) => b.points - a.points);
    
    return { success: true, data: pointsPerUser };
  } catch (error) {
    console.error("Error calculating points per user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to calculate points per user" 
    };
  }
}

// Update group agreement
export async function updateGroupAgreement(groupId: string, agreement: string): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return failure("User not authenticated");
    }
    
    const id = parseInt(groupId);
    
    if (isNaN(id)) {
      return failure("Invalid group ID");
    }
    
    // Check if the user is a member of the group
    const userGroup = await prisma.userToGroups.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: id
        }
      }
    });
    
    if (!userGroup) {
      return failure("You are not a member of this group");
    }
    
    // Update the group agreement
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: { agreement }
    });
    
    return success(updatedGroup);
  } catch (error) {
    return failure(error, "Failed to update group agreement");
  }
}