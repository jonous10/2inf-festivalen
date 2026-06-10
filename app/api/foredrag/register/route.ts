import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getSession } from "@/lib/session";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const user_id = session.userId;

    const contentType = req.headers.get("content-type") || "";
    let foredrag_id: any;
    if (contentType.includes("application/json")) {
      const body = await req.json();
      foredrag_id = body.foredrag_id;
    } else {
      const formData = await req.formData();
      foredrag_id = formData.get("foredrag_id");
    }

    const foredragIdNum = Number(foredrag_id);
    if (!foredragIdNum || isNaN(foredragIdNum)) {
      return NextResponse.json({ error: "invalid_id" }, { status: 400 });
    }

    const conn = await getConnection();

    // Sjekk antall påmeldinger
    const [countRows] = await conn.execute(
      "SELECT COUNT(*) AS antall FROM elever_foredrag WHERE user_id = ?",
      [user_id],
    );
    const antall = (countRows as any)[0].antall;
    if (antall >= 3) {
      await conn.end();
      return NextResponse.json(
        { error: "max3", redirect: "/festival/foredrag?error=max3" },
        { status: 409 },
      );
    }

    // Sjekk overlapp
    const [overlapRows] = await conn.execute(
      `SELECT f.id FROM foredrag f
       JOIN elever_foredrag ef ON ef.foredrag_id = f.id
       WHERE ef.user_id = ? AND (
         (f.startTid <= (SELECT sluttTid FROM foredrag WHERE id = ?) 
          AND f.sluttTid >= (SELECT startTid FROM foredrag WHERE id = ?))
       )`,
      [user_id, foredragIdNum, foredragIdNum],
    );
    if ((overlapRows as any).length > 0) {
      await conn.end();
      return NextResponse.json(
        { error: "overlap", redirect: "/festival/foredrag?error=overlap" },
        { status: 409 },
      );
    }

    // Sjekk kapasitet
    const [capRows] = await conn.execute(
      `SELECT maksPlasser, COUNT(ef.id) AS antallPaameldte
       FROM foredrag f
       LEFT JOIN elever_foredrag ef ON ef.foredrag_id = f.id
       WHERE f.id = ?
       GROUP BY f.id`,
      [foredragIdNum],
    );
    const capRow = (capRows as any)[0];
    const maksPlasser = capRow?.maksPlasser ?? 0;
    const antallPaameldte = capRow?.antallPaameldte ?? 0;
    if (antallPaameldte >= maksPlasser) {
      await conn.end();
      return NextResponse.json(
        { error: "fullt", redirect: "/festival/foredrag?error=fullt" },
        { status: 409 },
      );
    }

    // Registrer
    await conn.execute(
      "INSERT INTO elever_foredrag (user_id, foredrag_id) VALUES (?, ?)",
      [user_id, foredragIdNum],
    );
    await conn.end();

    return NextResponse.json(
      { ok: true, redirect: "/festival/mine-foredrag?success=1" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Feil ved påmelding:", error);
    return NextResponse.json(
      { error: "server", redirect: "/festival/foredrag?error=server" },
      { status: 500 },
    );
  }
}
