import { getConnection } from "@/lib/db";
import Link from "next/link";

export default async function BedrifterPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute("SELECT * FROM bedrifter ORDER BY navn");
  await conn.end();
  // @ts-ignore
  const bedrifter = Array.isArray(rows) ? rows : [];

  const getBransjeColor = (bransje: string) => {
    const colors: Record<string, string> = {
      "Rådgiving og teknologi": "#0066ff",
      "IT-infrastruktur": "#06b6d4",
      "Design og utvikling": "#7c3aed",
      Systemutvikling: "#059669",
      "Energi og digitalisering": "#dc2626",
      "Mobilitet og data": "#f59e0b",
      "Konsulent og teknologi": "#8b5cf6",
      "Sky og lisensiering": "#0891b2",
    };
    return colors[bransje] || "#6366f1";
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--foreground)" }}
          >
            🏢 Bedrifter
          </h1>
          <p style={{ color: "var(--muted)" }}>
            {bedrifter.length} bedrifter deltar på festivalen
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bedrifter.map((b: any) => (
            <div
              key={b.id}
              className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              {/* Topp info */}
              <div className="mb-4">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {b.navn}
                </h3>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: getBransjeColor(b.bransje) }}
                >
                  {b.bransje}
                </div>
              </div>

              {/* Stand nummer highlight */}
              <div
                className="mb-4 p-3 rounded-lg"
                style={{ background: "var(--primary)" }}
              >
                <p className="text-sm" style={{ color: "white" }}>
                  Stand
                </p>
                <p className="text-2xl font-bold" style={{ color: "white" }}>
                  {b.standnummer}
                </p>
              </div>

              {/* Detaljer */}
              <div className="space-y-3 mb-4">
                {/* Kontaktperson */}
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    👤 KONTAKTPERSON
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {b.kontaktperson}
                  </p>
                  <a
                    href={`mailto:${b.epost}`}
                    className="text-sm transition-colors duration-200 hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    ✉️ {b.epost}
                  </a>
                </div>

                {/* Nettside */}
                {b.nettside && (
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--muted)" }}
                    >
                      🌐 NETTSIDE
                    </p>
                    <Link
                      href={b.nettside}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors duration-200 hover:underline mt-1 inline-block"
                      style={{ color: "var(--accent)" }}
                    >
                      {b.nettside}
                    </Link>
                  </div>
                )}
              </div>

              {/* Foredrag badge */}
              {b.harForedrag && (
                <div
                  className="mt-4 p-3 rounded-lg"
                  style={{ background: "#10b981", opacity: 0.1 }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#10b981" }}
                  >
                    🎤 Holder foredrag
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
