import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function ElevMineForedragPage() {
  const elev_id = 1; // TODO: hent fra session / auth/me

  const conn = await getConnection();

  // Hent elevinfo
  const [elevRows] = await conn.execute<RowDataPacket[]>(
    "SELECT * FROM elever WHERE id = ? LIMIT 1",
    [elev_id],
  );

  // Hent elevens påmeldte foredrag
  const [foredragRows] = await conn.execute<RowDataPacket[]>(
    `SELECT f.tittel, f.startTid, f.sluttTid, f.rom, f.kategori, b.navn AS bedrift
     FROM elever_foredrag ef
     JOIN foredrag f ON ef.foredrag_id = f.id
     LEFT JOIN bedrifter b ON f.holderBedriftId = b.id
     WHERE ef.elev_id = ?
     ORDER BY f.startTid`,
    [elev_id],
  );

  await conn.end();

  const elev = elevRows.length > 0 ? elevRows[0] : null;
  const foredrag = foredragRows;

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
            🎓 Min Påmelding
          </h1>

          {elev && (
            <p style={{ color: "var(--muted)" }}>
              {elev.navn} • {elev.klasse} • Gruppe {elev.gruppe}
            </p>
          )}
        </div>

        {/* Ingen påmeldinger */}
        {foredrag.length === 0 && (
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
            {foredrag.map((f: any, index: number) => (
              <div
                key={index}
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

                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  🕒 {f.startTid} — {f.sluttTid}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
