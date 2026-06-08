import { getConnection } from "@/lib/db";

export default async function EleverPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM elever ORDER BY klasse, gruppe, navn LIMIT 200",
  );
  await conn.end();
  // @ts-ignore
  const elever = Array.isArray(rows) ? rows : [];

  const getRoleColor = (rolle: string) => {
    const colors: Record<string, string> = {
      Vertskap: "#10b981",
      Programvert: "#3b82f6",
      Assistent: "#f59e0b",
    };
    return colors[rolle] || "#6366f1";
  };

  const getInitials = (navn: string) => {
    return navn
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
            👥 Elever
          </h1>
          <p style={{ color: "var(--muted)" }}>
            {elever.length} deltakere på festivalen
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {elever.map((e: any) => (
            <div
              key={e.id}
              className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              {/* Avatar + Navn */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--accent))",
                  }}
                >
                  {getInitials(e.navn)}
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {e.navn}
                </h3>
              </div>

              {/* Rolle badge */}
              <div className="mb-4">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                  style={{ background: getRoleColor(e.rolle) }}
                >
                  🎯 {e.rolle}
                </span>
              </div>

              {/* Klasse og gruppe */}
              <div
                className="mb-4 p-3 rounded-lg"
                style={{
                  background: "var(--primary)",
                  opacity: 0.1,
                }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  📚 KLASSE & GRUPPE
                </p>
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: "var(--primary)" }}
                >
                  {e.klasse} • Gruppe {e.gruppe}
                </p>
              </div>

              {/* Epost */}
              <div>
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: "var(--muted)" }}
                >
                  ✉️ EPOST
                </p>
                <a
                  href={`mailto:${e.epost}`}
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {e.epost}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
