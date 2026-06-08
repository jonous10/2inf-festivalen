import { getConnection } from "@/lib/db";

export default async function LaererePage() {
  const conn = await getConnection();
  const [rows] = await conn.execute("SELECT * FROM laerere ORDER BY navn");
  await conn.end();
  // @ts-ignore
  const laerere = Array.isArray(rows) ? rows : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Lærere</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {laerere.map((l: any) => (
          <div key={l.id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">{l.navn}</h3>
            <p className="text-sm text-gray-600">{l.ansvarsomraade}</p>
            <p className="text-sm mt-2">Epost: {l.epost}</p>
            <p className="text-sm">Telefon: {l.telefon}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
