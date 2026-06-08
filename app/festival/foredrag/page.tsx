import { getConnection } from "@/lib/db";
import Link from "next/link";

export default async function ForedragPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT f.*, b.navn as bedrift FROM foredrag f LEFT JOIN bedrifter b ON f.holderBedriftId = b.id ORDER BY f.startTid`,
  );
  await conn.end();
  // @ts-ignore
  const foredrag = Array.isArray(rows) ? rows : [];

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
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            🎤 Foredrag
          </h1>
          <p style={{ color: "var(--muted)" }}>
            {foredrag.length} foredrag på festivalen
          </p>
        </div>

        {/* Liste */}
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Innhold */}
                <div className="flex-1">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {f.tittel}
                  </h3>
                  <p style={{ color: "var(--muted)" }} className="mb-4">
                    {f.beskrivelse}
                  </p>

                  {/* Tags og info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ background: getCategoryColor(f.kategori) }}
                    >
                      📌 {f.kategori}
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
                      👥 Maks {f.maksPlasser}
                    </span>
                  </div>

                  {/* Tid */}
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    🕐 {f.startTid} — {f.sluttTid}
                  </p>
                </div>

                {/* Bedrift sidebar */}
                <div
                  className="md:w-40 p-4 rounded-lg text-center"
                  style={{
                    background: "var(--primary)",
                    opacity: 0.1,
                  }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    HOLDER
                  </p>
                  <p
                    className="text-sm font-bold mt-2"
                    style={{ color: "var(--primary)" }}
                  >
                    {f.bedrift || "Ukjent"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
