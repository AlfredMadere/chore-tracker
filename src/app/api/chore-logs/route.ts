import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/chore-logs?id=123
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const choreLogId = id ? parseInt(id) : null;
    
    if (!choreLogId || isNaN(choreLogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid chore log ID" },
        { status: 400 }
      );
    }

    // Get the chore log to check if the user is authorized to delete it
    const choreLog = await prisma.choreLog.findUnique({
      where: { id: choreLogId },
      include: {
        chore: {
          select: {
            groupId: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!choreLog) {
      return NextResponse.json(
        { success: false, error: "Chore log not found" },
        { status: 404 }
      );
    }

    // Check if the user is the one who created the log
    if (choreLog.user.id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You can only delete your own chore logs" },
        { status: 403 }
      );
    }

    // Delete the chore log
    await prisma.choreLog.delete({
      where: { id: choreLogId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chore log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete chore log" },
      { status: 500 }
    );
  }
}
