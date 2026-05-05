import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { question, options } = await req.json();
    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.ownerId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const poll = await prisma.poll.create({
      data: {
        projectId: id,
        creatorId: session.user.id,
        question,
        options: {
          create: options.map((text) => ({ text }))
        }
      },
      include: {
        options: { include: { votes: true } }
      }
    });

    await pusherServer.trigger(CHANNELS.project(id), EVENTS.NEW_POLL, poll);

    return NextResponse.json(poll, { status: 201 });
  } catch (err) {
    console.error("[poll POST]", err);
    return NextResponse.json({ error: "Gagal membuat poll." }, { status: 500 });
  }
}
