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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Welcome, {user?.username}!
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="text-gray-900 font-medium capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {user?.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Link */}
            <Link href="/profile" className="block">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  My Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Update your profile and password
                </p>
              </div>
            </Link>

            {/* Admin: User Management */}
            <PermissionGate permission="manage_users">
              <Link href="/admin/users" className="block">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-600">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    User Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage users and their roles
                  </p>
                </div>
              </Link>
            </PermissionGate>

            {/* Admin: Role Management */}
            <PermissionGate permission="manage_roles">
              <Link href="/admin/roles" className="block">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-600">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Role Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create and manage roles with permissions
                  </p>
                </div>
              </Link>
            </PermissionGate>

            {/* Admin: Audit Logs */}
            <PermissionGate permission="view_audit_logs">
              <Link href="/admin/audit-logs" className="block">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-purple-600">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Audit Logs
                  </h3>
                  <p className="text-gray-600 text-sm">
                    View admin activity and changes
                  </p>
                </div>
              </Link>
            </PermissionGate>

            {/* Settings Link */}
            <Link href="/settings" className="block">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Settings
                </h3>
                <p className="text-gray-600 text-sm">
                  Application settings and preferences
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
