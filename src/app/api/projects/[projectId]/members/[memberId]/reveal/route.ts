import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string; memberId: string }> }) {
  const { projectId, memberId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const member = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: { user: true }
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (member.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!member.isAnonymous || member.revealedAt) {
      return NextResponse.json({ error: "Already revealed or not anonymous" }, { status: 400 });
    }

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: { revealedAt: new Date() },
      include: { user: true }
    });

    // Cari hub room "general" atau yang pertama untuk mengirim pesan sistem
    const room = await prisma.hubRoom.findFirst({
      where: { projectId, type: "GENERAL" }
    });

    if (room) {
      const systemMessage = await prisma.hubMessage.create({
        data: {
          roomId: room.id,
          senderId: session.user.id,
          content: `✨ Identitas terungkap!\nSudah reveal! — ini ${updatedMember.user.name} 😊`,
        },
        include: {
          sender: { select: { id: true, name: true, image: true, username: true } }
        }
      });

      // Broadcast system message ke room
      await pusherServer.trigger(CHANNELS.hubRoom(room.id), EVENTS.HUB_MESSAGE, {
        id: systemMessage.id,
        content: systemMessage.content,
        createdAt: systemMessage.createdAt,
        mentions: systemMessage.mentions,
        type: systemMessage.type,
        sender: {
          id: systemMessage.sender.id,
          name: systemMessage.sender.name,
          image: systemMessage.sender.image,
          isAnonymous: false
        }
      });
    }

    // Broadcast identity revealed
    await pusherServer.trigger(CHANNELS.project(projectId), EVENTS.IDENTITY_REVEALED, {
      memberId: updatedMember.id,
      userId: updatedMember.userId,
      userName: updatedMember.user.name,
      anonymousTag: updatedMember.anonymousTag
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (err) {
    console.error("[reveal identity error]", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
