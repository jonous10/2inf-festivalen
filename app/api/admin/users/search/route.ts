import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { searchUsers, hasPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canView = await hasPermission(session.userId, "view_users");
    if (!canView) {
      return NextResponse.json(
        { error: "You do not have permission to view users" },
        { status: 403 },
      );
    }

    const query = request.nextUrl.searchParams.get("q");

    if (!query || query.length < 1) {
      return NextResponse.json(
        { error: "Search query must be at least 1 character" },
        { status: 400 },
      );
    }

    const users = await searchUsers(query);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
