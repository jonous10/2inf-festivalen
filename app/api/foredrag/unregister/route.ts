import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const foredrag_id = formData.get("foredrag_id");
    const elev_id = 1; // TODO: hent fra session

    const conn = await getConnection();

    // Sjekk om påmelding finnes
    const [rows] = await conn.execute(
      "SELECT id FROM elever_foredrag WHERE elev_id = ? AND foredrag_id = ?",
      [elev_id, foredrag_id],
    );

    if ((rows as any).length === 0) {
      await conn.end();
      return NextResponse.redirect("/festival/elever?error=notfound");
    }

    // Slett påmelding
    await conn.execute(
      "DELETE FROM elever_foredrag WHERE elev_id = ? AND foredrag_id = ?",
      [elev_id, foredrag_id],
    );

    await conn.end();

    return NextResponse.redirect("/festival/elever?success=unregistered");
  } catch (error) {
    console.error("Feil ved avmelding:", error);
    return NextResponse.redirect("/festival/elever?error=server");
  }
}
