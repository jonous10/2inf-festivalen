import { getConnection } from "@/lib/db";

export default async function EleverPage() {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    "SELECT * FROM elever ORDER BY klasse, gruppe, navn LIMIT 200",
  );
  await conn.end();
  // @ts-ignore
  const elever = Array.isArray(rows) ? rows : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Elever</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {elever.map((e: any) => (
          <div key={e.id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">{e.navn}</h3>
            <p className="text-sm text-gray-600">
              Klasse: {e.klasse} • Gruppe: {e.gruppe}
            </p>
            <p className="text-sm mt-2">Rolle: {e.rolle}</p>
            <p className="text-sm">Epost: {e.epost}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
