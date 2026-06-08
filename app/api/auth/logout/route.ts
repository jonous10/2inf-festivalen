import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 },
    );
  }
}
