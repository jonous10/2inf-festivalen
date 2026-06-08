"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { PermissionGate } from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-200 flex flex-col ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="p-3 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-semibold text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
          >
            Menu
          </h2>

          <button
            onClick={() => setCollapsed((s) => !s)}
            aria-label="Toggle sidebar"
            className="p-1 rounded hover:bg-gray-100"
          >
            {collapsed ? (
              <svg
                className="w-5 h-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 5l6 5-6 5V5z" fill="currentColor" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 5l-6 5 6 5V5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                title={collapsed ? "Dashboard" : undefined}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z"
                    fill="currentColor"
                  />
                </svg>
                <span
                  className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  Dashboard
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                title={collapsed ? "My Profile" : undefined}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="8" r="3" fill="currentColor" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
                </svg>
                <span
                  className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  My Profile
                </span>
              </Link>
            </li>

            <PermissionGate permission="manage_users">
              <li>
                <Link
                  href="/admin/users"
                  title={collapsed ? "User Management" : undefined}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 11a4 4 0 10-8 0" fill="currentColor" />
                    <path d="M2 20a8 8 0 0116 0" fill="currentColor" />
                    <path
                      d="M18 7a3 3 0 10-6 0"
                      fill="currentColor"
                      opacity="0.9"
                    />
                  </svg>
                  <span
                    className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                  >
                    User Management
                  </span>
                </Link>
              </li>
            </PermissionGate>

            <PermissionGate permission="manage_roles">
              <li>
                <Link
                  href="/admin/roles"
                  title={collapsed ? "Role Management" : undefined}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"
                      fill="currentColor"
                    />
                  </svg>
                  <span
                    className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                  >
                    Role Management
                  </span>
                </Link>
              </li>
            </PermissionGate>

            <PermissionGate permission="view_audit_logs">
              <li>
                <Link
                  href="/admin/audit-logs"
                  title={collapsed ? "Audit Logs" : undefined}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12h18M3 6h18M3 18h18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                  >
                    Audit Logs
                  </span>
                </Link>
              </li>
            </PermissionGate>

            <li>
              <Link
                href="/settings"
                title={collapsed ? "Settings" : undefined}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8a4 4 0 100 8 4 4 0 000-8z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.4 12.94a7.05 7.05 0 000-1.88l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.6-.22l-2.49 1a7.06 7.06 0 00-1.61-.94L14.5 2.5a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5l-.38 2.24c-.56.2-1.09.48-1.6.82l-2.5-1a.5.5 0 00-.6.22l-2 3.46a.5.5 0 00.12.64L4.6 11.06a7.05 7.05 0 000 1.88L2.49 14.6a.5.5 0 00-.12.64l2 3.46c.14.24.43.34.68.26l2.49-1c.5.34 1.04.62 1.6.82L9.5 21.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5l.38-2.24c.56-.2 1.09-.48 1.61-.82l2.49 1c.25.08.54-.02.68-.26l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
                <span
                  className={`text-sm text-gray-900 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                >
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-4">
          <div className="border-t pt-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-700">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div className={`${collapsed ? "hidden" : "flex-1"}`}>
              <div className="text-sm text-gray-600">{user?.username}</div>
              <button
                onClick={handleLogout}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
            {collapsed && (
              <button
                onClick={handleLogout}
                className="ml-auto p-1 rounded hover:bg-gray-100"
                aria-label="Logout"
              >
                <svg
                  className="w-5 h-5 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
