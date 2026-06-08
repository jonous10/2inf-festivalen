import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  updateUserRole,
  deleteUser,
  hasPermission,
  logAuditAction,
} from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "manage_users");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage users" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: "User ID and Role ID are required" },
        { status: 400 },
      );
    }

    // Prevent user from changing their own role
    if (userId === session.userId) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 },
      );
    }

    await updateUserRole(userId, roleId);

    // Log audit action
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await logAuditAction(
      session.userId,
      "update_user_role",
      "user",
      userId,
      { roleId },
      clientIp,
    );

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canManage = await hasPermission(session.userId, "delete_users");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to delete users" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Prevent user from deleting themselves
    if (userId === session.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    await deleteUser(userId);

    // Log audit action
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await logAuditAction(
      session.userId,
      "delete_user",
      "user",
      userId,
      null,
      clientIp,
    );

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
