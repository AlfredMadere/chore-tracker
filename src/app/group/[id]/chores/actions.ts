"use server";

import prisma from "@/lib/prisma";

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

// Add a new chore
export async function addChore(groupId: string, name: string, points: number) {
  try {
    const id = parseInt(groupId);
    
    if (isNaN(id)) {
      throw new Error("Invalid group ID");
    }
    
    if (!name || name.trim() === "") {
      throw new Error("Chore name is required");
    }
    
    if (isNaN(points) || points < 0) {
      throw new Error("Points must be a positive number");
    }
    
    const chore = await prisma.chore.create({
      data: {
        name: name.trim(),
        points,
        groupId: id
      }
    });
    
    return { success: true, data: chore };
  } catch (error) {
    console.error("Error adding chore:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add chore" 
    };
  }
}

// Delete a chore
export async function deleteChore(choreId: number) {
  try {
    if (isNaN(choreId)) {
      throw new Error("Invalid chore ID");
    }
    
    // Check if the chore exists
    const chore = await prisma.chore.findUnique({
      where: { id: choreId }
    });
    
    if (!chore) {
      throw new Error("Chore not found");
    }
    
    // Delete the chore
    await prisma.chore.delete({
      where: { id: choreId }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting chore:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete chore" 
    };
  }
}
