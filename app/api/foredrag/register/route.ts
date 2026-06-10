import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const foredrag_id = formData.get("foredrag_id");
    const elev_id = 1; // TODO: hent fra session eller auth/me senere

    const conn = await getConnection();

    // Sjekk antall påmeldinger
    const [countRows] = await conn.execute(
      "SELECT COUNT(*) AS antall FROM elever_foredrag WHERE elev_id = ?",
      [elev_id],
    );
    const antall = (countRows as any)[0].antall;
    if (antall >= 3) {
      await conn.end();
      return NextResponse.json(
        { error: "Du kan kun melde deg på tre foredrag." },
        { status: 400 },
      );
    }

    // Sjekk overlapp i tid
    const [overlapRows] = await conn.execute(
      `SELECT f.id FROM foredrag f
       JOIN elever_foredrag ef ON ef.foredrag_id = f.id
       WHERE ef.elev_id = ? AND (
         (f.startTid <= (SELECT sluttTid FROM foredrag WHERE id = ?) AND f.sluttTid >= (SELECT startTid FROM foredrag WHERE id = ?))
       )`,
      [elev_id, foredrag_id, foredrag_id],
    );
    if ((overlapRows as any).length > 0) {
      await conn.end();
      return NextResponse.json(
        { error: "Du er allerede påmeldt et foredrag som overlapper i tid." },
        { status: 400 },
      );
    }

    // Sjekk kapasitet
    const [capRows] = await conn.execute(
      `SELECT maksPlasser, COUNT(ef.id) AS antallPaameldte
       FROM foredrag f
       LEFT JOIN elever_foredrag ef ON ef.foredrag_id = f.id
       WHERE f.id = ?
       GROUP BY f.id`,
      [foredrag_id],
    );
    const { maksPlasser, antallPaameldte } = (capRows as any)[0];
    if (antallPaameldte >= maksPlasser) {
      await conn.end();
      return NextResponse.json(
        { error: "Foredraget er fullt." },
        { status: 400 },
      );
    }

    // Registrer påmelding
    await conn.execute(
      "INSERT INTO elever_foredrag (elev_id, foredrag_id) VALUES (?, ?)",
      [elev_id, foredrag_id],
    );
    await conn.end();

    return NextResponse.redirect("/festival/elever");
  } catch (error) {
    console.error("Feil ved påmelding:", error);
    return NextResponse.json(
      { error: "Noe gikk galt under påmelding." },
      { status: 500 },
    );
  }
}
