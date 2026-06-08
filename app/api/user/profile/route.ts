import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateUserProfile } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 },
      );
    }

    await updateUserProfile(session.userId, username, email);

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
