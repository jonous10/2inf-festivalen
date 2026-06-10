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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-200"
        style={{ background: "var(--primary)", color: "white" }}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col border-r
    ${collapsed ? "w-20" : "w-64"}
    fixed md:sticky md:top-0 md:h-screen
    left-0 z-40
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-lg font-bold transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
              style={{ color: "var(--foreground)" }}
            >
              Menu
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="md:hidden p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>

              <button
                onClick={() => setCollapsed((s) => !s)}
                aria-label="Toggle sidebar"
                className="hidden md:block p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ background: "var(--primary)", color: "white" }}
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
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  title={collapsed ? "Home" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--primary)" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12l10-10 10 10v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9z"
                      fill="currentColor"
                    />
                  </svg>
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    Home
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  title={collapsed ? "Dashboard" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--primary)" }}
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
                    className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    Dashboard
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  title={collapsed ? "My Profile" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--accent)" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="8" r="3" fill="currentColor" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
                  </svg>
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    My Profile
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/festival/mine-foredrag"
                  onClick={closeMobileMenu}
                  title={collapsed ? "Mine Foredrag" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--primary)" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502 0l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v2H3V5z"
                      fill="currentColor"
                    />
                    <path
                      d="M3 8h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                      fill="currentColor"
                    />
                  </svg>
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    Mine Foredrag
                  </span>
                </Link>
              </li>

              <PermissionGate permission="manage_users">
                <li>
                  <Link
                    href="/admin/foredrag"
                    onClick={closeMobileMenu}
                    title={collapsed ? "Foredrag Oversikt" : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--primary)" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="currentColor"
                      />
                    </svg>
                    <span
                      className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      style={{ color: "var(--foreground)" }}
                    >
                      Foredrag Oversikt
                    </span>
                  </Link>
                </li>
              </PermissionGate>

              <PermissionGate permission="manage_users">
                <li>
                  <Link
                    href="/admin/users"
                    onClick={closeMobileMenu}
                    title={collapsed ? "User Management" : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--primary)" }}
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
                      className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      style={{ color: "var(--foreground)" }}
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
                    onClick={closeMobileMenu}
                    title={collapsed ? "Role Management" : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--primary)" }}
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
                      className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      style={{ color: "var(--foreground)" }}
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
                    onClick={closeMobileMenu}
                    title={collapsed ? "Audit Logs" : undefined}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                    style={{ color: "var(--foreground)" }}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--primary)" }}
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
                      className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                      style={{ color: "var(--foreground)" }}
                    >
                      Audit Logs
                    </span>
                  </Link>
                </li>
              </PermissionGate>

              <li>
                <Link
                  href="/settings"
                  onClick={closeMobileMenu}
                  title={collapsed ? "Settings" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--accent)" }}
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
                    className={`text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    Settings
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <div
              className="border-t pt-4 flex items-center gap-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent))",
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <div className={`flex-1 ${collapsed ? "hidden" : ""}`}>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-sm transition-all duration-200 hover:scale-105"
                  style={{ color: "var(--primary)" }}
                >
                  Logout
                </button>
              </div>
              {collapsed && (
                <button
                  onClick={handleLogout}
                  className="ml-auto p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ background: "var(--primary)", color: "white" }}
                  aria-label="Logout"
                >
                  <svg
                    className="w-5 h-5"
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
    </div>
  );
}
