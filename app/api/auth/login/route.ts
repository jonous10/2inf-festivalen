import { NextRequest, NextResponse } from "next/server";
import { verifyUserPassword, getUserWithPermissions } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { rateLimit, getRateLimitStatus } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit: 10 login attempts per minute per IP
    const rateLimitKey = `login:${clientIp}`;
    if (!rateLimit(rateLimitKey, 10, 60000)) {
      const status = getRateLimitStatus(rateLimitKey, 10);
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (status.resetTime! - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Verify credentials
    const user = await verifyUserPassword(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Get user with permissions
    const userWithPermissions = await getUserWithPermissions(user.id);
    if (!userWithPermissions) {
      throw new Error("Failed to retrieve user permissions");
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.role_id,
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: userWithPermissions.role,
          permissions: userWithPermissions.permissions,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMessage);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    // TEMPORARY: Show detailed errors for debugging (remove in production)
    return NextResponse.json(
      { error: `Login failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
