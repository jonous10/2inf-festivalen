import Link from "next/link";
import { getConnection } from "@/lib/db";

export default async function FestivalPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM festival ORDER BY id DESC LIMIT 1",
  );
  await conn.end();
  const festival = Array.isArray(rows) && rows.length ? (rows[0] as any) : null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <h1
        className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Festivaloversikt
      </h1>

      {festival ? (
        <div
          className="rounded-lg shadow p-4 sm:p-6 mb-6"
          style={{ background: "var(--card-bg)" }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {festival.navn}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem sm:1rem" }}>
            {festival.beskrivelse}
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                Dato
              </p>
              <p
                className="font-medium text-sm sm:text-base"
                style={{ color: "var(--foreground)" }}
              >
                {new Date(festival.dato).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                Sted
              </p>
              <p
                className="font-medium text-sm sm:text-base"
                style={{ color: "var(--foreground)" }}
              >
                {festival.sted} — {festival.bygning}
              </p>
            </div>
            <div>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                Tid
              </p>
              <p
                className="font-medium text-sm sm:text-base"
                style={{ color: "var(--foreground)" }}
              >
                {festival.startTid} — {festival.sluttTid}
              </p>
            </div>
            <div>
              <p
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                Kontakt
              </p>
              <p
                className="font-medium text-sm sm:text-base"
                style={{ color: "var(--foreground)" }}
              >
                {festival.kontaktEpost}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border p-4 rounded mb-6"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          Ingen festivaldata funnet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/festival/bedrifter" className="block">
          <div
            className="rounded shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              Utstillere
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Se bedrifter, standnummer og foredrag
            </p>
          </div>
        </Link>

        <Link href="/festival/foredrag" className="block">
          <div
            className="rounded shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              Foredrag
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Tidspunkt, rom og kapasitet
            </p>
          </div>
        </Link>

        <Link href="/festival/rom" className="block">
          <div
            className="rounded shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              Romoversikt
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Rom, kapasitet og utstyr
            </p>
          </div>
        </Link>

        <Link href="/festival/laerere" className="block">
          <div
            className="rounded shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              Lærere
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Kontaktpersoner og ansvarsområder
            </p>
          </div>
        </Link>

        <Link href="/festival/elever" className="block">
          <div
            className="rounded shadow p-4 sm:p-6 hover:shadow-md transition-shadow"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="font-semibold text-base sm:text-lg"
              style={{ color: "var(--foreground)" }}
            >
              Elever
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              Frivillige og ansvar
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
