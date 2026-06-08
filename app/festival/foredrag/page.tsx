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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Foredrag</h1>

      <div className="space-y-3">
        {foredrag.map((f: any) => (
          <div key={f.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{f.tittel}</h3>
                <p className="text-sm text-gray-600">{f.beskrivelse}</p>
                <p className="mt-2 text-sm">
                  Kategori: {f.kategori} — Rom: {f.rom}
                </p>
                <p className="text-sm">
                  Tid: {f.startTid} — {f.sluttTid} • Maks: {f.maksPlasser}
                </p>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{f.bedrift || "Ukjent"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
