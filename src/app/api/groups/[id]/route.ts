import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/groups/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }
    
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        users: true,
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
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}

// PATCH /api/groups/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = parseInt(params.id);
    
    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }
    
    const data = await request.json();
    
    if (!data.name || typeof data.name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { name: data.name },
    });
    
    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}
