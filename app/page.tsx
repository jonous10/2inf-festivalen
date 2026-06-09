import Link from "next/link";
import { getConnection } from "@/lib/db";

interface Festival {
  id: number;
  navn: string;
  beskrivelse?: string;
  dato?: string;
  sted?: string;
  kapasitet?: number;
}

export default async function Home() {
  let festivals: Festival[] = [];

  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM festival");
    conn.end();

    if (Array.isArray(rows)) {
      festivals = rows.map((row: any) => ({
        id: row.id,
        navn: row.navn,
        beskrivelse: row.beskrivelse,
        dato: row.dato,
        sted: row.sted,
        kapasitet: row.kapasitet,
      }));
    }
  } catch (error) {
    console.error("Feil ved henting av festivaler:", error);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Navigasjonsbar */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 bg-white/80 dark:bg-slate-950/80"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ background: "var(--primary)" }}
              />
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                2INF Festival
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ color: "var(--primary)" }}
              >
                Logg inn
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ background: "var(--primary)" }}
              >
                Registrer deg
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full py-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Seksjon */}
        <div className="text-center mb-20">
          <div
            className="inline-block mb-4 px-4 py-2 rounded-full"
            style={{
              background: "var(--card-bg)",
              border: "1px solid",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              🎉 Velkommen til
            </span>
          </div>
          <h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "var(--foreground)" }}
          >
            2INF Festivalen
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-4"
            style={{ color: "var(--muted)" }}
          >
            Møt diverse IT-bedrifter, elever og fagfolk fra hele landet. En dag
            fullt av inspirasjon, læring og samarbeid!
          </p>
          <p
            className="text-sm md:text-base max-w-2xl mx-auto mb-10"
            style={{ color: "var(--muted)" }}
          >
            Utforsk bedrifter, foredrag, rom og møt andre IT-interesserte.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ background: "var(--primary)" }}
            >
              Logg inn
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg border-2 hover:scale-105"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              Opprett konto
            </Link>
          </div>
        </div>

        {/* Festival Navigasjon */}
        <div className="mb-20">
          <h3
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: "var(--foreground)" }}
          >
            Utforsk Festivalen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/festival/bedrifter"
              className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Bedrifter
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Se alle IT-bedriftene som deltar
              </p>
            </Link>

            <Link
              href="/festival/foredrag"
              className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Foredrag
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Spennende presentasjoner fra fagfolk
              </p>
            </Link>

            <Link
              href="/festival/rom"
              className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Rom
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Se rom og utstyr på stedet
              </p>
            </Link>

            <Link
              href="/festival/elever"
              className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent))",
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m4 5h4m-7 3h10a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Elever
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Finn andre deltakere og lag nettverk
              </p>
            </Link>
          </div>
        </div>

        {/* Kommende Festivaler */}
        <div className="mb-20">
          <h3
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: "var(--foreground)" }}
          >
            📅 Kommende Festivaler
          </h3>
          {festivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {festivals.map((festival) => (
                <div
                  key={festival.id}
                  className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4
                        className="text-xl font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {festival.navn}
                      </h4>
                      {festival.dato && (
                        <p
                          style={{
                            color: "var(--accent)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {new Date(festival.dato).toLocaleDateString("no-NO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      Kommende
                    </span>
                  </div>
                  {festival.beskrivelse && (
                    <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                      {festival.beskrivelse}
                    </p>
                  )}
                  <div
                    style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                    className="space-y-2"
                  >
                    {festival.sted && <p>📍 Sted: {festival.sted}</p>}
                    {festival.kapasitet && (
                      <p>👥 Kapasitet: {festival.kapasitet} deltakere</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-8 rounded-2xl text-center"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <p style={{ color: "var(--muted)" }}>
                Ingen festivaler registrert ennå.
              </p>
            </div>
          )}
        </div>

        {/* Funksjoner */}
        <div>
          <h3
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: "var(--foreground)" }}
          >
            Hva kan du gjøre her?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Sikker Innlogging
              </h4>
              <p style={{ color: "var(--muted)" }}>
                Din data er beskyttet med sterkeste kryptering. Enkelt og
                sikkert.
              </p>
            </div>

            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Roller & Tilgang
              </h4>
              <p style={{ color: "var(--muted)" }}>
                Fleksibelt system for å administrere brukerrettigheter og
                roller.
              </p>
            </div>

            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "var(--card-bg)",
                border: "1px solid",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent))",
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4
                className="text-lg font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Kraftig & Intuitiv
              </h4>
              <p style={{ color: "var(--muted)" }}>
                Lett å navigere og administrere festivalen med intuitiv
                kontrollpanel.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
