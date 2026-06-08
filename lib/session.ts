import { cookies } from "next/headers";
import { jwtVerify, SignJWT, JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

export interface SessionPayload extends JWTPayload {
  userId: number;
  email: string;
  username: string;
  roleId: number;
}

export async function createSession(payload: SessionPayload): Promise<void> {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "your-secret-key-change-in-production"
  ) {
    throw new Error(
      "JWT_SECRET is not properly configured in .env.local or .env.production",
    );
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();

  // Cookie configuration - works for both localhost and production domains
  const cookieOptions: any = {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  // Secure flag for HTTPS
  // - Production with HTTPS: secure = true (recommended)
  // - Production with HTTP (dev/testing): use ALLOW_INSECURE_COOKIES flag
  // - Development: secure = false (localhost works with HTTP)
  if (process.env.NODE_ENV === "production") {
    // Allow override for HTTP in production (development/testing only)
    if (process.env.ALLOW_INSECURE_COOKIES === "true") {
      cookieOptions.secure = false;
      console.log(
        "⚠️  Using insecure cookies (HTTP). Only for development/testing!",
      );
    } else {
      // Default: require HTTPS in production
      cookieOptions.secure = true;
    }
  } else {
    // Development: HTTP is fine
    cookieOptions.secure = false;
  }

  // If running on a domain (not localhost), set it explicitly
  if (
    process.env.NEXT_PUBLIC_DOMAIN &&
    process.env.NEXT_PUBLIC_DOMAIN !== "localhost"
  ) {
    cookieOptions.domain = process.env.NEXT_PUBLIC_DOMAIN;
  }

  cookieStore.set("auth_token", token, cookieOptions);
  console.log("✅ Session cookie created for user:", payload.email);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, SECRET);
    return verified.payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
