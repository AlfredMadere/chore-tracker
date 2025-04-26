"use server";

import { prisma } from "@/lib/prisma";

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
export async function getPointsPerUser(id: string) {
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