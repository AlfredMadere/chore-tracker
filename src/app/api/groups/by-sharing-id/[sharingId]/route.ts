import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { sharingId: string } }
) {
  try {
    const sharingId = params.sharingId;
    
    if (!sharingId) {
      return NextResponse.json({ error: "Sharing ID is required" }, { status: 400 });
    }
    
    const group = await prisma.group.findUnique({
      where: { sharingId },
      select: { id: true, name: true }
    });
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    return NextResponse.json(group);
  } catch (error) {
    console.error("Error finding group by sharing ID:", error);
    return NextResponse.json({ error: "Failed to find group" }, { status: 500 });
  }
}
