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
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { name: true } },
      }
    });
    return NextResponse.json(reports);
  } catch (err) {
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
