"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ForedragActionButton from "@/app/components/ForedragButtons";

interface Foredrag {
  id: number;
  tittel: string;
  startTid: string;
  sluttTid: string;
  rom: string;
  kategori: string;
  bedrift?: string;
}

export default function MineForedragPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [foredrag, setForedrag] = useState<Foredrag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!user) {
      // Not logged in, redirect to login
      router.push("/login");
      return;
    }

    // Fetch user's enrolled foredrag from the server
    const fetchEnrolledForedrag = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/foredrag/enrolled?userId=${user.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch enrolled foredrag");
        }
        const data = await response.json();
        setForedrag(data.foredrag || []);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente dine påmeldinger");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledForedrag();
  }, [user, loading, router]);

  const getCategoryColor = (kategori: string) => {
    const colors: Record<string, string> = {
      Utvikling: "#3b82f6",
      Drift: "#10b981",
      Sikkerhet: "#ef4444",
      Karriere: "#f59e0b",
      "Kunstig intelligens": "#8b5cf6",
      Kunnskap: "#0ea5e9",
    };
    return colors[kategori] || "#6366f1";
  };

  if (loading || isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p style={{ color: "var(--muted)" }}>Laster...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            🎓 Mine Foredrag
          </h1>

          {user && (
            <p style={{ color: "var(--muted)" }}>
              {user.username} • {foredrag.length} påmeldt
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div
            className="p-4 rounded-lg mb-6"
            style={{ background: "#fee2e2", color: "#991b1b" }}
          >
            {error}
          </div>
        )}

        {/* Ingen påmeldinger */}
        {foredrag.length === 0 && !error && (
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <p style={{ color: "var(--muted)" }}>
              Du er ikke påmeldt noen foredrag ennå.
            </p>
          </div>
        )}

        {/* Liste over påmeldte foredrag */}
        {foredrag.length > 0 && (
          <div className="space-y-4">
            {foredrag.map((f: any) => (
              <div
                key={f.id}
                className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border-l-4"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid",
                  borderColor: "var(--border)",
                  borderLeftColor: getCategoryColor(f.kategori),
                }}
              >
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {f.tittel}
                </h3>

                <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                  📍 {f.bedrift || "Ukjent bedrift"}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ background: getCategoryColor(f.kategori) }}
                  >
                    {f.kategori}
                  </span>

                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    🏛️ Rom {f.rom}
                  </span>
                </div>

                <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                  🕒 {f.startTid} — {f.sluttTid}
                </p>

                <div>
                  <ForedragActionButton
                    foredragId={f.id}
                    variant="unregister"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
