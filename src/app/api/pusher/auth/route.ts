import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id");
    const channel = params.get("channel_name");

    if (!socketId || !channel) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const projectMatch = channel.match(/^(private|presence)-project-([a-zA-Z0-9_-]+)$/);
    if (projectMatch) {
      const projectId = projectMatch[2];
      const member = await prisma.projectMember.findFirst({
        where: { projectId, userId: session.user.id },
        select: { id: true }
      });
      if (!member) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const hubMatch = channel.match(/^(private|presence)-hub-([a-zA-Z0-9_-]+)$/);
    if (hubMatch) {
      const projectId = hubMatch[2];
      const member = await prisma.projectMember.findFirst({
        where: { projectId, userId: session.user.id },
        select: { id: true }
      });
      if (!member) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const userMatch = channel.match(/^private-user-([a-zA-Z0-9_-]+)$/);
    if (userMatch) {
      const targetUserId = userMatch[1];
      if (session.user.id !== targetUserId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (channel.startsWith("presence-")) {
      const presenceData = {
        user_id: session.user.id,
        user_info: {
          name: session.user.name,
          image: session.user.image,
          trustScore: session.user.trustScore,
          trustLevel: session.user.trustLevel,
        },
      };
      const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
      return NextResponse.json(authResponse);
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (err) {
    console.error("[pusher auth]", err);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
