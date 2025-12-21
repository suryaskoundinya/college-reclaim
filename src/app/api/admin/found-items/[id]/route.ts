import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    // Delete the found item
    await prisma.foundItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Found item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting found item:", error);
    return NextResponse.json(
      { error: "Failed to delete found item" },
      { status: 500 }
    );
  }
}
