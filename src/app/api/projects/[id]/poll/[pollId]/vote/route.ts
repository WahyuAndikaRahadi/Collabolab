import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string, pollId: string }> }) {
  const { id, pollId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { optionId } = await req.json();
    if (!optionId) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

    const member = await prisma.projectMember.findFirst({ where: { projectId: id, userId: session.user.id } });
    if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Check if vote exists
    const existingVote = await prisma.pollVote.findFirst({
      where: {
        option: { pollId },
        userId: session.user.id
      }
    });

    if (existingVote) return NextResponse.json({ error: "Kamu sudah vote di poll ini." }, { status: 400 });

    await prisma.pollVote.create({
      data: {
        optionId,
        userId: session.user.id
      }
    });

    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { include: { votes: true } } }
    });

    await pusherServer.trigger(CHANNELS.project(id), EVENTS.POLL_UPDATED, updatedPoll);

    return NextResponse.json(updatedPoll);
  } catch (err) {
    console.error("[poll vote POST]", err);
    return NextResponse.json({ error: "Gagal memberikan vote." }, { status: 500 });
  }
}
