"use server";

import { prisma } from "@/lib/prisma";

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

// Add a new chore
export async function addChore(groupId: string, name: string, points: number, description: string = "") {
  try {
   
    // verify that we aren't making a duplicate chore
    const choreExists = await prisma.chore.findUnique({
      where: { name_groupId: { name: name.trim(), groupId: parseInt(groupId) } }
    });
    
    if (choreExists) {
      throw new Error("Chore already exists");
    }
    
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
        description,
        groupId: id
      }
    });
    //TODO: handle the case where the chore already exists, send back a reasonable error
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

// Update an existing chore
export async function updateChore(choreId: number, name: string, points: number, description: string = "") {
  try {
    if (isNaN(choreId)) {
      throw new Error("Invalid chore ID");
    }
    
    // Check if the chore exists
    const existingChore = await prisma.chore.findUnique({
      where: { id: choreId }
    });
    
    if (!existingChore) {
      throw new Error("Chore not found");
    }
    
    if (!name || name.trim() === "") {
      throw new Error("Chore name is required");
    }
    
    if (isNaN(points) || points < 0) {
      throw new Error("Points must be a positive number");
    }
    
    // Check if another chore with the same name exists (excluding the current chore)
    const duplicateChore = await prisma.chore.findFirst({
      where: {
        name: name.trim(),
        groupId: existingChore.groupId,
        id: { not: choreId }
      }
    });
    
    if (duplicateChore) {
      throw new Error("Another chore with this name already exists");
    }
    
    // Update the chore
    const updatedChore = await prisma.chore.update({
      where: { id: choreId },
      data: {
        name: name.trim(),
        points,
        description
      }
    });
    
    return { success: true, data: updatedChore };
  } catch (error) {
    console.error("Error updating chore:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update chore" 
    };
  }
}
