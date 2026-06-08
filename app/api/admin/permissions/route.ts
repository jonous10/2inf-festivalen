import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAllPermissions, hasPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canView = await hasPermission(session.userId, "manage_permissions");
    if (!canView) {
      return NextResponse.json(
        { error: "You do not have permission to view permissions" },
        { status: 403 },
      );
    }

    const permissions = await getAllPermissions();

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error("Get permissions error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
