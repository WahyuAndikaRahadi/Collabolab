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
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { members: true, tasks: true } }
      }
    });
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) return NextResponse.json({ error: "ID Project diperlukan" }, { status: 400 });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "ARCHIVED" }
    });

    return NextResponse.json({ message: "Project berhasil di take down (Archived)" });
  } catch (err) {
    return NextResponse.json({ error: "Gagal me-take down project" }, { status: 500 });
  }
}
