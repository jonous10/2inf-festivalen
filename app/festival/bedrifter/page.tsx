import { getConnection } from "@/lib/db";
import Link from "next/link";

export default async function BedrifterPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute("SELECT * FROM bedrifter ORDER BY navn");
  await conn.end();
  // @ts-ignore
  const bedrifter = Array.isArray(rows) ? rows : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Bedrifter</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bedrifter.map((b: any) => (
          <div key={b.id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold text-lg">{b.navn}</h3>
            <p className="text-sm text-gray-600">{b.bransje}</p>
            <p className="mt-2 text-sm">
              Stand: <span className="font-medium">{b.standnummer}</span>
            </p>
            <p className="text-sm mt-2">
              Kontakt: {b.kontaktperson} — {b.epost}
            </p>
            {b.nettside && (
              <p className="text-sm mt-2">
                Nettside:{" "}
                <Link
                  href={b.nettside}
                  className="text-blue-600 hover:underline"
                >
                  {b.nettside}
                </Link>
              </p>
            )}
            {b.harForedrag ? (
              <div className="mt-3 inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Holder foredrag
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
