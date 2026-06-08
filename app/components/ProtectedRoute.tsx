"use client";

import { ReactNode } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please log in to continue.</p>
            <Link href="/login" className="text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      )
    );
  }

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You do not have permission to access this page.
            </p>
            <Link href="/" className="text-blue-600 hover:underline">
              Go Home
            </Link>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback,
}: PermissionGateProps) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !user.permissions.includes(permission)) {
    return fallback || null;
  }

  return <>{children}</>;
}
