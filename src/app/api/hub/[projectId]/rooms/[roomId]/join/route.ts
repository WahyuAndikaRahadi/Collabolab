import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

type Params = { params: Promise<{ projectId: string; roomId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { projectId, roomId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const room = await prisma.hubRoom.findUnique({ where: { id: roomId } });
  if (!room || room.projectId !== projectId) {
    return NextResponse.json({ error: "Room tidak ditemukan." }, { status: 404 });
  }

  if (!room.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json();
  const { password } = body as { password?: string };

  if (!password) return NextResponse.json({ error: "Password diperlukan untuk room ini." }, { status: 400 });

  const valid = await bcrypt.compare(password, room.passwordHash);
  if (!valid) return NextResponse.json({ error: "Password salah." }, { status: 401 });

  return NextResponse.json({ ok: true });
}
