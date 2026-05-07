import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ],
        ...(status ? { status: status as any } : {}),
      },
      select: {
        id: true,
        title: true,
        status: true,
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[USER_PROJECTS_GET]", error);
    return NextResponse.json({ error: "Gagal mengambil data project" }, { status: 500 });
  }
}
