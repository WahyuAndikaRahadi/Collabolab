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
    const reports = await prisma.$queryRawUnsafe<any[]>(
      `SELECT r.*, u.name as "reporterName" 
       FROM "Report" r 
       JOIN "User" u ON r."reporterId" = u.id 
       ORDER BY r."createdAt" DESC`
    );
    
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
    
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) return NextResponse.json({ error: "Report tidak ditemukan" }, { status: 404 });

    if (status === "RESOLVED" && report.targetType === "FEED_POST") {
      try {
        await prisma.feedPost.delete({ where: { id: report.targetId } });
      } catch (err) {
        console.warn("FeedPost might have already been deleted", err);
      }
    }

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status }
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[ADMIN_REPORT_PATCH]", err);
    return NextResponse.json({ error: "Gagal update report" }, { status: 500 });
  }
}
