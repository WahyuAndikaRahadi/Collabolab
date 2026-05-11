import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    // Using raw query to bypass any potential stale Prisma client issues
    const reports = await prisma.$queryRawUnsafe<any[]>(
      `SELECT r.*, u.name as "reporterName" 
       FROM "Report" r 
       JOIN "User" u ON r."reporterId" = u.id 
       ORDER BY r."createdAt" DESC`
    );
    
    // Format to match the client's expected structure (with nested reporter object)
    const formatted = (reports || []).map(r => ({
      ...r,
      reporter: { name: r.reporterName }
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Admin reports fetch error:", err);
    return NextResponse.json({ error: "Gagal mengambil data report" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { reportId, status } = await req.json();
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status }
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Gagal update report" }, { status: 500 });
  }
}
