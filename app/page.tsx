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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Nordic Devices</h1>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:underline font-medium"
              >
                Products
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Velkommen til 2INF Festivalen!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Møt en rekke diverse IT bedrifter og andre IT interesserte
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Sign in securely with email and password. Your data is protected
              with industry-standard encryption.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Role Management
            </h3>
            <p className="text-gray-600">
              Control user access with flexible role-based permissions. Admin
              panel for easy user management.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Permission System
            </h3>
            <p className="text-gray-600">
              Fine-grained permissions to control what each user can access and
              modify in the system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
