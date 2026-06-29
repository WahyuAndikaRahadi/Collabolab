import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  mentions: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id },
      select: { id: true }
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const messages = await prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        projectId: true,
        senderId: true,
        content: true,
        mentions: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    let nextCursor: string | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      items: messages.reverse(),
      nextCursor
    });
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

    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id },
      select: { isAnonymous: true, revealedAt: true, anonymousTag: true }
    });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const message = await prisma.chatMessage.create({
      data: {
        projectId,
        senderId: session.user.id,
        content: parsed.data.content,
        mentions: parsed.data.mentions
      },
      select: {
        id: true,
        projectId: true,
        senderId: true,
        content: true,
        mentions: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    const isAnon = member.isAnonymous && !member.revealedAt;
    const displayName = isAnon
      ? `Anon#${member.anonymousTag || "0000"}`
      : message.sender.name;

    await pusherServer.trigger(CHANNELS.project(projectId), EVENTS.NEW_MESSAGE, {
      ...message,
      sender: {
        ...message.sender,
        name: displayName,
        isAnonymous: isAnon
      }
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

    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { id: true, senderId: true, projectId: true }
    });
    if (!message) return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
    if (message.projectId !== projectId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id },
      select: { role: true }
    });
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
