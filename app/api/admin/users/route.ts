import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  getAllUsers,
  getAllRoles,
  updateUserRole,
  deleteUser,
  hasPermission,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user has permission to manage users
    const canManage = await hasPermission(session.userId, "manage_users");
    if (!canManage) {
      return NextResponse.json(
        { error: "You do not have permission to manage users" },
        { status: 403 },
      );
    }

    const users = await getAllUsers();
    const roles = await getAllRoles();

    return NextResponse.json({
      users,
      roles,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
