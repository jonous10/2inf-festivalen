import { getConnection } from "@/lib/db";

export default async function RomPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT r.*, GROUP_CONCAT(ru.utstyr SEPARATOR ', ') as utstyr FROM rom r LEFT JOIN rom_utstyr ru ON r.id = ru.rom_id GROUP BY r.id ORDER BY r.romnummer`,
  );
  await conn.end();
  // @ts-ignore
  const rom = Array.isArray(rows) ? rows : [];

  const getBygningColor = (bygning: string) => {
    const colors: Record<string, string> = {
      Teknologibygget: "#0066ff",
      Hovedbygget: "#06b6d4",
      Laboratoriebygget: "#7c3aed",
      Auditoriet: "#059669",
    };
    return colors[bygning] || "#6366f1";
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
            🏛️ Romoversikt
          </h1>
          <p style={{ color: "var(--muted)" }}>{rom.length} rom tilgjengelig</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rom.map((r: any) => (
            <div
              key={r.id}
              className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              {/* Romnummer */}
              <div className="mb-4">
                <h3
                  className="text-3xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {r.romnummer}
                </h3>
              </div>

              {/* Bygning */}
              <div
                className="mb-4 p-3 rounded-lg"
                style={{ background: getBygningColor(r.bygning) }}
              >
                <p className="text-xs font-semibold" style={{ color: "white" }}>
                  🏢 BYGNING
                </p>
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: "white" }}
                >
                  {r.bygning}
                </p>
              </div>

              {/* Kapasitet */}
              <div
                className="mb-4 p-3 rounded-lg"
                style={{ background: "var(--primary)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "white" }}>
                  👥 KAPASITET
                </p>
                <p
                  className="text-2xl font-bold mt-1"
                  style={{ color: "white" }}
                >
                  {r.kapasitet}
                </p>
              </div>

              {/* Utstyr */}
              {r.utstyr && (
                <div>
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: "var(--muted)" }}
                  >
                    🔧 UTSTYR
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.utstyr.split(", ").map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "var(--accent)",
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
