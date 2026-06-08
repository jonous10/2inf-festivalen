import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createPasswordResetToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a reset link will be sent",
        },
        { status: 200 },
      );
    }

    const resetToken = await createPasswordResetToken(user.id);

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a reset link will be sent",
        // In production, remove this line - it's only for development
        ...(process.env.NODE_ENV === "development" && { token: resetToken }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
