"use server";

import prisma from "@/lib/prisma";

export async function getGroupById(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Group ID is required" };
    }
    
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true }
    });
    
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    
    return { success: true, data: group };
  } catch (error) {
    console.error("Error finding group:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to find group" 
    };
  }
}

export async function joinGroupAction(groupId: string, email: string, name?: string) {
  try {
    if (!groupId) {
      return { success: false, error: "Group ID is required" };
    }
    
    if (!email || email.trim() === "") {
      return { success: false, error: "Email is required" };
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    
    if (!group) {
      return { success: false, error: "Group not found" };
    }
    
    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.trim(),
          name: name?.trim() || null,
        },
      });
    } else if (name && name.trim() !== "" && user.name !== name.trim()) {
      // Update the user's name if it's different and provided
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
    }
    
    // Check if the user is already in the group
    const existingMembership = await prisma.group.findFirst({
      where: {
        id: parseInt(groupId),
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });
    
    if (!existingMembership) {
      // Add the user to the group
      await prisma.group.update({
        where: { id: parseInt(groupId) },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });
    }
    
    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined
      }
    };
  } catch (error) {
    console.error("Error joining group:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to join group" 
    };
  }
}
