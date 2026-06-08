import { getConnection } from "@/lib/db";

export default async function RomPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT r.*, GROUP_CONCAT(ru.utstyr SEPARATOR ', ') as utstyr FROM rom r LEFT JOIN rom_utstyr ru ON r.id = ru.rom_id GROUP BY r.id ORDER BY r.romnummer`,
  );
  await conn.end();
  // @ts-ignore
  const rom = Array.isArray(rows) ? rows : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Romoversikt</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rom.map((r: any) => (
          <div key={r.id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">{r.romnummer}</h3>
            <p className="text-sm text-gray-600">Bygning: {r.bygning}</p>
            <p className="text-sm">Kapasitet: {r.kapasitet}</p>
            <p className="text-sm mt-2">Utstyr: {r.utstyr || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
