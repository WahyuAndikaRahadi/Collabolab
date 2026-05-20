import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

type Params = { params: Promise<{ projectId: string; roomId: string; messageId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { projectId, roomId, messageId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { optionId } = body as { optionId: string };

  if (!optionId) return NextResponse.json({ error: "Opsi harus dipilih" }, { status: 400 });

  const message = await prisma.hubMessage.findUnique({
    where: { id: messageId, roomId },
    include: {
      poll: {
        include: { options: true }
      }
    }
  });

  if (!message || !message.poll) {
    return NextResponse.json({ error: "Poll tidak ditemukan" }, { status: 404 });
  }

  const validOption = message.poll.options.find(opt => opt.id === optionId);
  if (!validOption) {
    return NextResponse.json({ error: "Opsi tidak valid" }, { status: 400 });
  }

  const existingVotes = await prisma.hubPollVote.findMany({
    where: {
      userId,
      option: { pollId: message.poll.id }
    }
  });

  for (const vote of existingVotes) {
    await prisma.hubPollVote.delete({ where: { id: vote.id } });
  }

  const clickedSame = existingVotes.some(v => v.optionId === optionId);
  
  if (!clickedSame) {
    await prisma.hubPollVote.create({
      data: {
        userId,
        optionId,
      }
    });
  }

  const updatedPoll = await prisma.hubPoll.findUnique({
    where: { id: message.poll.id },
    include: {
      options: {
        include: { 
          votes: {
            include: { user: { select: { id: true, name: true, username: true, image: true } } }
          }
        }
      }
    }
  });

  try {
    await pusherServer.trigger(CHANNELS.hubRoom(roomId), "hub-poll-vote", {
      messageId,
      poll: updatedPoll
    });
  } catch (e) {
    console.error("[Pusher Error]", e);
  }

  return NextResponse.json({ success: true, poll: updatedPoll });
}
