import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const foredrag_id = formData.get("foredrag_id");
    const elev_id = 1; // TODO: hent fra session

    const conn = await getConnection();

    // Sjekk antall påmeldinger
    const [countRows] = await conn.execute(
      "SELECT COUNT(*) AS antall FROM elever_foredrag WHERE elev_id = ?",
      [elev_id],
    );
    const antall = (countRows as any)[0].antall;
    if (antall >= 3) {
      await conn.end();
      return NextResponse.redirect("/festival/foredrag?error=max3", {
        status: 303,
      });
    }

    // Sjekk overlapp
    const [overlapRows] = await conn.execute(
      `SELECT f.id FROM foredrag f
       JOIN elever_foredrag ef ON ef.foredrag_id = f.id
       WHERE ef.elev_id = ? AND (
         (f.startTid <= (SELECT sluttTid FROM foredrag WHERE id = ?) 
          AND f.sluttTid >= (SELECT startTid FROM foredrag WHERE id = ?))
       )`,
      [elev_id, foredrag_id, foredrag_id],
    );
    if ((overlapRows as any).length > 0) {
      await conn.end();
      return NextResponse.redirect("/festival/foredrag?error=overlap", {
        status: 303,
      });
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
      return NextResponse.redirect("/festival/foredrag?error=fullt", {
        status: 303,
      });
    }

    // Registrer
    await conn.execute(
      "INSERT INTO elever_foredrag (elev_id, foredrag_id) VALUES (?, ?)",
      [elev_id, foredrag_id],
    );
    await conn.end();

    return NextResponse.redirect("/festival/elever?success=1", { status: 303 });
  } catch (error) {
    console.error("Feil ved påmelding:", error);
    return NextResponse.redirect("/festival/foredrag?error=server", {
      status: 303,
    });
  }
}
