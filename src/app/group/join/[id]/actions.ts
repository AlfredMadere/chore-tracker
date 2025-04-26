"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function joinGroupById(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", data: null };
  }
  
  try {
    // Find the group by sharingId
    const group = await prisma.group.findUnique({
      where: { sharingId: id },
      include: {
        userGroups: {
          where: { userId: session.user.id }
        }
      }
    });
    
    if (!group) {
      return { success: false, error: "Group not found", data: null };
    }
    
    // Check if user is already a member
    if (group.userGroups.length > 0) {
      // User is already a member, just return the group ID
      return { 
        success: true, 
        data: { groupId: group.id } 
      };
    }
    
    // Add user to the group
    await prisma.userToGroups.create({
      data: {
        userId: session.user.id,
        groupId: group.id
      }
    });
    
    return { 
      success: true, 
      data: { groupId: group.id } 
    };
  } catch (error) {
    console.error("Error joining group:", error);
    return { success: false, error: "Failed to join group", data: null };
  }
}
