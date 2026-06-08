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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Festivaloversikt</h1>

      {festival ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold">{festival.navn}</h2>
          <p className="text-gray-600">{festival.beskrivelse}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Dato</p>
              <p className="font-medium">
                {new Date(festival.dato).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sted</p>
              <p className="font-medium">
                {festival.sted} — {festival.bygning}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tid</p>
              <p className="font-medium">
                {festival.startTid} — {festival.sluttTid}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kontakt</p>
              <p className="font-medium">{festival.kontaktEpost}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
          Ingen festivaldata funnet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/festival/bedrifter" className="block">
          <div className="bg-white rounded shadow p-4 hover:shadow-md">
            <h3 className="font-semibold">Utstillere</h3>
            <p className="text-sm text-gray-500">
              Se bedrifter, standnummer og foredrag
            </p>
          </div>
        </Link>

        <Link href="/festival/foredrag" className="block">
          <div className="bg-white rounded shadow p-4 hover:shadow-md">
            <h3 className="font-semibold">Foredrag</h3>
            <p className="text-sm text-gray-500">Tidspunkt, rom og kapasitet</p>
          </div>
        </Link>

        <Link href="/festival/rom" className="block">
          <div className="bg-white rounded shadow p-4 hover:shadow-md">
            <h3 className="font-semibold">Romoversikt</h3>
            <p className="text-sm text-gray-500">Rom, kapasitet og utstyr</p>
          </div>
        </Link>

        <Link href="/festival/laerere" className="block">
          <div className="bg-white rounded shadow p-4 hover:shadow-md">
            <h3 className="font-semibold">Lærere</h3>
            <p className="text-sm text-gray-500">
              Kontaktpersoner og ansvarsområder
            </p>
          </div>
        </Link>

        <Link href="/festival/elever" className="block">
          <div className="bg-white rounded shadow p-4 hover:shadow-md">
            <h3 className="font-semibold">Elever</h3>
            <p className="text-sm text-gray-500">Frivillige og ansvar</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
