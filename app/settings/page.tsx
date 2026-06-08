"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Dashboard
                </Link>
                <span className="text-gray-400">/</span>
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Your Permissions
            </h2>
            <div className="flex flex-wrap gap-2">
              {user?.permissions && user.permissions.length > 0 ? (
                user.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No permissions assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
