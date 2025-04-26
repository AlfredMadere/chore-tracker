"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserGroups() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated", data: null };
  }
  
  try {
    const userWithGroups = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userGroups: {
          include: {
            group: true
          }
        }
      }
    });
    
    if (!userWithGroups) {
      return { success: false, error: "User not found", data: null };
    }
    console.log(userWithGroups);
    return { 
      success: true, 
      data: userWithGroups?.userGroups?.map((group) => group.group) || []
    };
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return { success: false, error: "Failed to fetch groups", data: null };
  }
}
