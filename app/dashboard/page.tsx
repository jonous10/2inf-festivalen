"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ProtectedRoute,
  PermissionGate,
} from "@/app/components/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Dashboard
            </h1>
          </div>

          {/* User Info Card */}
          <div
            className="rounded-lg shadow p-4 sm:p-6 mb-8"
            style={{ background: "var(--card-bg)" }}
          >
            <h2
              className="text-lg sm:text-xl font-bold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Welcome, {user?.username}!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Email
                </p>
                <p
                  className="font-medium text-sm sm:text-base"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.email}
                </p>
              </div>
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Role
                </p>
                <p
                  className="font-medium text-sm sm:text-base capitalize"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p
                className="text-xs sm:text-sm mb-2"
                style={{ color: "var(--muted)" }}
              >
                Permissions
              </p>
              <div className="flex flex-wrap gap-2">
                {user?.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-block px-3 py-1 text-xs sm:text-sm rounded-full text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation moved to sidebar */}
          <div
            className="rounded-lg shadow p-4 sm:p-6"
            style={{ background: "var(--card-bg)" }}
          >
            <p style={{ color: "var(--muted)" }}>
              Quick actions have been moved to the left sidebar.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
