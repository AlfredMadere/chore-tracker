"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function joinGroupByCode(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", data: null };
  }
  
  const joinCode = formData.get("joinCode") as string;
  
  if (!joinCode || joinCode.trim() === "") {
    return { success: false, error: "Join code is required", data: null };
  }
  
  try {
    // Find the group by sharingId
    const group = await prisma.group.findUnique({
      where: { sharingId: joinCode.trim() },
      include: {
        userGroups: {
          where: { userId: session.user.id }
        }
      }
    });
    
    if (!group) {
      return { success: false, error: "Invalid join code", data: null };
    }
    
    // Check if user is already a member
    if (group.userGroups.length > 0) {
      return { success: false, error: "You are already a member of this group", data: null };
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
