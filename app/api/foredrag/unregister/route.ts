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

    const foredragId = Number(foredrag_id);

    if (!foredragId || isNaN(foredragId)) {
      return NextResponse.json({ error: "invalid_id" }, { status: 400 });
    }

    const conn = await getConnection();

    // Sjekk om påmelding finnes
    const [rows] = await conn.execute(
      "SELECT id FROM elever_foredrag WHERE user_id = ? AND foredrag_id = ?",
      [user_id, foredragId],
    );

    if ((rows as any).length === 0) {
      await conn.end();
      return NextResponse.json({ error: "notfound" }, { status: 404 });
    }

    // Slett påmelding
    await conn.execute(
      "DELETE FROM elever_foredrag WHERE user_id = ? AND foredrag_id = ?",
      [user_id, foredragId],
    );

    await conn.end();

    return NextResponse.json(
      { ok: true, redirect: "/festival/mine-foredrag?success=unregistered" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Feil ved avmelding:", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
