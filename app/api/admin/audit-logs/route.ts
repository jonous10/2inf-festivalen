import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAuditLogs, hasPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const canView = await hasPermission(session.userId, "view_audit_logs");
    if (!canView) {
      return NextResponse.json(
        { error: "You do not have permission to view audit logs" },
        { status: 403 },
      );
    }

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "100");
    const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

    const logs = await getAuditLogs(Math.min(limit, 100), offset);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Get audit logs error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
