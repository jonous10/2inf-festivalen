import { getConnection } from "@/lib/db";
import Link from "next/link";
import ForedragActionButton from "@/app/components/ForedragButtons";

export default async function ForedragPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(`
    SELECT f.*, b.navn AS bedrift, 
           COUNT(ef.id) AS antallPaameldte
    FROM foredrag f
    LEFT JOIN bedrifter b ON f.holderBedriftId = b.id
    LEFT JOIN elever_foredrag ef ON ef.foredrag_id = f.id
    GROUP BY f.id
    ORDER BY f.startTid
  `);
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
      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
            style={{ color: "var(--foreground)" }}
          >
            🎤 Foredrag
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem sm:1rem" }}>
            {foredrag.length} foredrag på festivalen
          </p>
        </div>

        {/* Liste */}
        <div className="space-y-3 sm:space-y-4">
          {foredrag.map((f: any) => {
            const ledige = f.maksPlasser - f.antallPaameldte;
            return (
              <div
                key={f.id}
                className="rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg border-l-4"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid",
                  borderColor: "var(--border)",
                  borderLeftColor: getCategoryColor(f.kategori),
                }}
              >
                <div className="flex flex-col gap-4">
                  {/* Innhold */}
                  <div className="flex-1">
                    <h3
                      className="text-lg sm:text-xl lg:text-2xl font-bold mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {f.tittel}
                    </h3>
                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: "0.875rem sm:1rem",
                      }}
                      className="mb-4"
                    >
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
                        👥 {f.antallPaameldte}/{f.maksPlasser} påmeldt
                      </span>
                    </div>

                    {/* Tid og holder */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        🕐 {f.startTid} — {f.sluttTid}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        📍 Holder: {f.bedrift || "Ukjent"}
                      </p>
                    </div>

                    {/* Påmelding */}
                    <div>
                      {/* @ts-ignore Server -> client prop passing */}
                      <ForedragActionButton
                        foredragId={f.id}
                        variant="register"
                        disabled={ledige <= 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
