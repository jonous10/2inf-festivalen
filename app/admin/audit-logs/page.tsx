"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import Link from "next/link";

interface AuditLog {
  id: number;
  admin_id: number;
  admin_username: string;
  action: string;
  resource_type: string;
  resource_id: number | null;
  changes: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/admin/audit-logs?limit=100");
        if (!response.ok) {
          throw new Error("Failed to fetch audit logs");
        }
        const data = await response.json();
        setLogs(data.logs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getActionBadgeColor = (action: string): string => {
    if (action.startsWith("create")) return "bg-green-100 text-green-800";
    if (action.startsWith("update")) return "bg-blue-100 text-blue-800";
    if (action.startsWith("delete")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatAction = (action: string): string => {
    return action.replace(/_/g, " ").toUpperCase();
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="view_audit_logs">
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="view_audit_logs">
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
                <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
              </div>
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

          {/* Audit Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Admin Actions ({logs.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {log.admin_username}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(
                              log.action,
                            )}`}
                          >
                            {formatAction(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {log.resource_type}
                          {log.resource_id && ` #${log.resource_id}`}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {log.ip_address || "N/A"}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No audit logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
