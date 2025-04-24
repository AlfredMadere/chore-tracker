import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { groupId, email, name } = await request.json();
    
    if (!groupId || !email) {
      return NextResponse.json(
        { message: "Group ID and email are required" },
        { status: 400 }
      );
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Create new user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
        },
      });
    }
    
    // Check if user is already in the group
    const existingMembership = await prisma.group.findFirst({
      where: {
        id: groupId,
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });
    
    if (existingMembership) {
      return NextResponse.json(
        { message: "User is already a member of this group" },
        { status: 200 }
      );
    }
    
    // Add user to the group
    await prisma.group.update({
      where: { id: groupId },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    
    return NextResponse.json(
      { 
        message: "Successfully joined group",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { message: "Failed to join group" },
      { status: 500 }
    );
  }
}
