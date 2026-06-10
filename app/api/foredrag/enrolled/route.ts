import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Get userId from query param as backup/validation
    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const userId = queryUserId ? Number(queryUserId) : session.userId;

    // Security: only allow users to see their own enrollments (unless admin)
    if (userId !== session.userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const conn = await getConnection();

    // Hent brukerens påmeldte foredrag
    const [foredragRows] = await conn.execute(
      `SELECT f.id, f.tittel, f.startTid, f.sluttTid, f.rom, f.kategori, b.navn AS bedrift
       FROM elever_foredrag ef
       JOIN foredrag f ON ef.foredrag_id = f.id
       LEFT JOIN bedrifter b ON f.holderBedriftId = b.id
       WHERE ef.user_id = ?
       ORDER BY f.startTid`,
      [userId],
    );

    await conn.end();

    return NextResponse.json({ foredrag: foredragRows || [] }, { status: 200 });
  } catch (error) {
    console.error("Feil ved henting av påmeldinger:", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
