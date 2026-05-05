import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

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

    // For presence channels, include user info
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

    // For private channels
    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (err) {
    console.error("[pusher auth]", err);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
