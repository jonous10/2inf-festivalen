"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function AdminUsersPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newRoleId, setNewRoleId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        setRoles(data.roles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    setSearchLoading(true);

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/admin/users/search?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) {
          throw new Error("Search failed");
        }
        const data = await response.json();
        setFilteredUsers(data.users);
      } catch (err) {
        console.error("Search error:", err);
        setError("Search failed");
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRoleId) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/users/[id]", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser, roleId: newRoleId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user role");
      }

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === selectedUser ? { ...u, role_id: newRoleId } : u,
        ),
      );
      setFilteredUsers(
        filteredUsers.map((u) =>
          u.id === selectedUser ? { ...u, role_id: newRoleId } : u,
        ),
      );
      setSelectedUser(null);
      setNewRoleId(null);
      setSuccess("User role updated successfully");
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/users/[id]", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u.id !== userId));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userId));
      setSuccess("User deleted successfully");
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="manage_users">
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  };

  return (
    <ProtectedRoute requiredPermission="manage_users">
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
                <h1 className="text-xl font-bold text-gray-900">
                  User Management
                </h1>
              </div>
              <Link
                href="/admin/roles"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Manage Roles
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 p-4 rounded border border-red-200 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-4 rounded border border-green-200 mb-6">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <input
              type="text"
              placeholder="Search users by username, email, or ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {searchLoading && (
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {u.username}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {u.email}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {getRoleName(u.role_id)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm space-x-2">
                          {u.id !== user?.id && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedUser(u.id);
                                  setNewRoleId(u.role_id);
                                }}
                                className="text-blue-600 hover:underline"
                              >
                                Edit Role
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Role Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Change User Role
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="roleSelect"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Role
                    </label>
                    <select
                      id="roleSelect"
                      value={newRoleId || ""}
                      onChange={(e) => setNewRoleId(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateRole}
                      disabled={updating || !newRoleId}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setNewRoleId(null);
                      }}
                      className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
