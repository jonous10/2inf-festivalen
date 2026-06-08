"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import Link from "next/link";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

export default function AdminRolesPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/roles");
        if (!response.ok) {
          throw new Error("Failed to fetch roles and permissions");
        }
        const data = await response.json();
        setRoles(data.roles);
        setPermissions(data.permissions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || selectedPermissions.length === 0) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const method = editingRoleId ? "PUT" : "POST";
      const body = editingRoleId
        ? {
            roleId: editingRoleId,
            name: formData.name,
            description: formData.description,
            permissionIds: selectedPermissions,
          }
        : {
            name: formData.name,
            description: formData.description,
            permissionIds: selectedPermissions,
          };

      const response = await fetch("/api/admin/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save role");
      }

      // Refresh roles
      const rolesResponse = await fetch("/api/admin/roles");
      if (rolesResponse.ok) {
        const data = await rolesResponse.json();
        setRoles(data.roles);
      }

      setFormData({ name: "", description: "" });
      setSelectedPermissions([]);
      setShowCreateForm(false);
      setEditingRoleId(null);
      setSuccess(`Role ${editingRoleId ? "updated" : "created"} successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setFormData({
      name: role.name,
      description: role.description,
    });
    setSelectedPermissions(
      role.permissions ? role.permissions.map((p) => p.id) : [],
    );
    setShowCreateForm(true);
    setError("");
    setSuccess("");
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete role");
      }

      setRoles(roles.filter((r) => r.id !== roleId));
      setSuccess("Role deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId],
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="manage_roles">
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="manage_roles">
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
                  Role Management
                </h1>
              </div>
              <Link
                href="/admin/users"
                className="text-blue-600 hover:underline"
              >
                Manage Users
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

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h2 className="text-lg font-bold mb-4">
                {editingRoleId ? "Edit Role" : "Create New Role"}
              </h2>
              <form onSubmit={handleCreateRole}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={Boolean(editingRoleId && editingRoleId <= 2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="e.g., Moderator, Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      disabled={Boolean(editingRoleId && editingRoleId <= 2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="Describe the role's purpose"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-start space-x-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            disabled={Boolean(
                              editingRoleId && editingRoleId <= 2,
                            )}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {perm.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {perm.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={
                        submitting ||
                        Boolean(editingRoleId && editingRoleId <= 2)
                      }
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {submitting
                        ? "Saving..."
                        : editingRoleId
                          ? "Update Role"
                          : "Create Role"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingRoleId(null);
                        setFormData({ name: "", description: "" });
                        setSelectedPermissions([]);
                      }}
                      className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Create Button */}
          {!showCreateForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create New Role
              </button>
            </div>
          )}

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  {role.id > 2 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {role.id <= 2 && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Permissions ({role.permissions?.length || 0}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {perm.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">
                        No permissions assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
