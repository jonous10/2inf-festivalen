import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserWithPermissions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get fresh user data with permissions
    const user = await getUserWithPermissions(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
