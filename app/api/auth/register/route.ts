import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  getUserByEmail,
  verifyUserPassword,
  getUserWithPermissions,
} from "@/lib/auth";
import { createSession } from "@/lib/session";
import { rateLimit, getRateLimitStatus } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit: 5 registration attempts per minute per IP
    const rateLimitKey = `register:${clientIp}`;
    if (!rateLimit(rateLimitKey, 5, 60000)) {
      const status = getRateLimitStatus(rateLimitKey, 5);
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
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
    const { username, email, password, confirmPassword } = body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Create user
    const user = await createUser(username, email, password);
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
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: userWithPermissions.role,
          permissions: userWithPermissions.permissions,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
