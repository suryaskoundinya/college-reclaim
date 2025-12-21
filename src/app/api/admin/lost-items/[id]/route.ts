import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete the lost item
    await prisma.lostItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Lost item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lost item:", error);
    return NextResponse.json(
      { error: "Failed to delete lost item" },
      { status: 500 }
    );
  }
}
