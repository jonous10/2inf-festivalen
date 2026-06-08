"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ background: "var(--primary)" }}
              />
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                2INF Festival
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ color: "var(--primary)" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "var(--primary)" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className="inline-block mb-4 px-4 py-2 rounded-full"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Welcome to
            </span>
          </div>
          <h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "var(--foreground)" }}
          >
            2INF Festivalen
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--muted)" }}
          >
            Meet diverse IT companies, students, and professionals. Connect,
            learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ background: "var(--primary)" }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg border-2 hover:scale-105"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div
            className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Secure & Safe
            </h3>
            <p style={{ color: "var(--muted)" }}>
              Industry-standard encryption and secure authentication keep your
              data safe.
            </p>
          </div>
          <div
            className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Flexible Roles
            </h3>
            <p style={{ color: "var(--muted)" }}>
              Granular permission system for complete control over user access
              and capabilities.
            </p>
          </div>
          <div
            className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Powerful
            </h3>
            <p style={{ color: "var(--muted)" }}>
              Manage roles, permissions, and users efficiently with an intuitive
              admin panel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
