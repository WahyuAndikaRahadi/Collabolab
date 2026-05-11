import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  mentions: z.array(z.string()).default([]),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const member = await prisma.projectMember.findFirst({ where: { projectId, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const messages = await prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: { sender: { select: { id: true, name: true, image: true } } } as any,
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("[chat GET]", err);
    return NextResponse.json({ error: "Gagal memuat pesan." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

    const member = await prisma.projectMember.findFirst({ where: { projectId, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const message = await prisma.chatMessage.create({
      data: { projectId, senderId: session.user.id, content: parsed.data.content, mentions: parsed.data.mentions },
      include: { sender: { select: { id: true, name: true, image: true } } } as any,
    });

    // Handle anonymous display name
    const displayName = member.isAnonymous && !member.revealedAt
      ? `Anon#${member.anonymousTag || "0000"}`
      : (message as any).sender.name;

    await pusherServer.trigger(CHANNELS.project(projectId), EVENTS.NEW_MESSAGE, {
      ...message,
      sender: { ...(message as any).sender, name: displayName, isAnonymous: member.isAnonymous && !member.revealedAt },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("[chat POST]", err);
    return NextResponse.json({ error: "Gagal mengirim pesan." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    if (!messageId) return NextResponse.json({ error: "ID pesan diperlukan." }, { status: 400 });

    const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });

    // Check if user is sender or project owner/admin
    const member = await prisma.projectMember.findFirst({ where: { projectId, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const isSender = message.senderId === session.user.id;
    const canModerate = member.role === "OWNER" || member.role === "ADMIN";

    if (!isSender && !canModerate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.chatMessage.delete({ where: { id: messageId } });

    await pusherServer.trigger(CHANNELS.project(projectId), EVENTS.MESSAGE_DELETED, { messageId });

    return NextResponse.json({ message: "Pesan berhasil dihapus." });
  } catch (err) {
    console.error("[chat DELETE]", err);
    return NextResponse.json({ error: "Gagal menghapus pesan." }, { status: 500 });
  }
}
