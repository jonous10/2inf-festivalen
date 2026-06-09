import { getConnection } from "@/lib/db";

export default async function LaererePage() {
  const conn = await getConnection();
  const [rows] = await conn.execute("SELECT * FROM laerere ORDER BY navn");
  await conn.end();
  // @ts-ignore
  const laerere = Array.isArray(rows) ? rows : [];

  return (
    <div
      className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <h1
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8"
        style={{ color: "var(--foreground)" }}
      >
        👨‍🏫 Lærere
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {laerere.map((l: any) => (
          <div
            key={l.id}
            className="rounded shadow p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              {l.navn}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem sm:1rem" }}>
              {l.ansvarsomraade}
            </p>
            <p
              className="text-xs sm:text-sm mt-3"
              style={{ color: "var(--muted)" }}
            >
              📧 {l.epost}
            </p>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              📞 {l.telefon}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
