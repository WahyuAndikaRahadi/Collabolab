import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reason, description } = await req.json();

  if (!reason) {
    return NextResponse.json({ error: "Alasan harus diisi" }, { status: 400 });
  }

  try {
    const feedPost = await prisma.feedPost.findUnique({ where: { id: postId } });
    if (!feedPost) {
      return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
    }

    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetId: postId,
        targetType: "FEED_POST",
      }
    });

    if (existingReport) {
      return NextResponse.json({ error: "Kamu sudah melaporkan post ini" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetId: postId,
        targetType: "FEED_POST",
        reason,
        description,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("[FEED_REPORT_POST]", error);
    return NextResponse.json({ error: "Gagal mengirim laporan" }, { status: 500 });
  }
}
