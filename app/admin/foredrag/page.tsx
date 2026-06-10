import { getConnection } from "@/lib/db";
import Link from "next/link";
import {
  ProtectedRoute,
  PermissionGate,
} from "@/app/components/ProtectedRoute";

export const dynamic = "force-dynamic";

export default async function AdminForedragPage() {
  const conn = await getConnection();

  // Hent alle foredrag med alle påmeldinger
  const [foredragRows] = await conn.execute(`
    SELECT f.*, b.navn AS bedrift
    FROM foredrag f
    LEFT JOIN bedrifter b ON f.holderBedriftId = b.id
    ORDER BY f.startTid
  `);

  // For each foredrag, get all enrolled users
  let foredragWithEnrollments: any[] = [];
  if (Array.isArray(foredragRows)) {
    for (const foredrag of foredragRows) {
      const [enrolledUsers] = await conn.execute(
        `SELECT u.id, u.username, u.email
         FROM elever_foredrag ef
         JOIN users u ON ef.user_id = u.id
         WHERE ef.foredrag_id = ?
         ORDER BY u.username`,
        [(foredrag as any).id],
      );
      foredragWithEnrollments.push({
        ...foredrag,
        enrolled: Array.isArray(enrolledUsers) ? enrolledUsers : [],
      });
    }
  }

  await conn.end();

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

  return (
    <ProtectedRoute>
      <PermissionGate permission="manage_users">
        <div
          className="min-h-screen"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: "var(--foreground)" }}
              >
                📊 Foredrag Påmeldinger (Admin)
              </h1>
              <p style={{ color: "var(--muted)" }}>
                {foredragWithEnrollments.length} foredrag totalt
              </p>
            </div>

            {/* Liste over foredrag med påmeldte brukere */}
            <div className="space-y-6">
              {foredragWithEnrollments.map((f: any) => (
                <div
                  key={f.id}
                  className="rounded-2xl p-6 border-l-4"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid",
                    borderColor: "var(--border)",
                    borderLeftColor: getCategoryColor(f.kategori),
                  }}
                >
                  {/* Foredrag Info */}
                  <div className="mb-6">
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {f.tittel}
                    </h2>
                    <p
                      className="text-sm mb-3"
                      style={{ color: "var(--muted)" }}
                    >
                      {f.beskrivelse}
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
                        style={{
                          background: "var(--primary)",
                          color: "white",
                        }}
                      >
                        🏛️ Rom {f.rom}
                      </span>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: "var(--accent)",
                          color: "white",
                        }}
                      >
                        👥 {f.enrolled?.length || 0}/{f.maksPlasser} påmeldt
                      </span>
                    </div>

                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      🕐 {f.startTid} — {f.sluttTid} | 📍{" "}
                      {f.bedrift || "Ukjent"}
                    </p>
                  </div>

                  {/* Enrolled Users */}
                  <div
                    className="border-t pt-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h3
                      className="text-sm font-semibold mb-3"
                      style={{ color: "var(--foreground)" }}
                    >
                      Påmeldte brukere ({f.enrolled?.length || 0}):
                    </h3>

                    {f.enrolled && f.enrolled.length > 0 ? (
                      <ul className="space-y-2">
                        {f.enrolled.map((user: any) => (
                          <li
                            key={user.id}
                            className="flex items-center justify-between p-2 rounded"
                            style={{
                              background: "var(--border)",
                              opacity: 0.5,
                            }}
                          >
                            <div>
                              <p
                                className="font-medium"
                                style={{ color: "var(--foreground)" }}
                              >
                                {user.username}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "var(--muted)" }}
                              >
                                {user.email}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "var(--muted)" }}>
                        Ingen brukere påmeldt ennå.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PermissionGate>
    </ProtectedRoute>
  );
}
