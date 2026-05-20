import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createRoomSchema = z.object({
  name: z.string().min(1).max(32),
  description: z.string().max(200).optional(),
  password: z.string().min(4).max(50).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rooms = await prisma.hubRoom.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      passwordHash: false,
      createdAt: true,
      _count: { select: { messages: true } },
    },
  });

  const rawRooms = await prisma.hubRoom.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, description: true, type: true, passwordHash: true, createdAt: true },
  });

  const result = rawRooms.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    type: r.type,
    isPrivate: !!r.passwordHash,
    createdAt: r.createdAt,
  }));

  return NextResponse.json(result);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member || member.role !== "OWNER") {
    return NextResponse.json({ error: "Hanya owner yang bisa membuat room baru." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createRoomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid: " + parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, description, password } = parsed.data;

  const normalizedName = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!normalizedName) return NextResponse.json({ error: "Nama room tidak valid." }, { status: 400 });

  const existing = await prisma.hubRoom.findFirst({ where: { projectId, name: normalizedName } });
  if (existing) return NextResponse.json({ error: "Room dengan nama ini sudah ada." }, { status: 409 });

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

  const room = await prisma.hubRoom.create({
    data: {
      projectId,
      name: normalizedName,
      description: description ?? null,
      type: "CUSTOM",
      passwordHash: passwordHash ?? null,
    },
  });

  try {
    await pusherServer.trigger(CHANNELS.hub(projectId), EVENTS.HUB_ROOM_CREATED, {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      isPrivate: !!room.passwordHash,
      createdAt: room.createdAt,
    });
  } catch {}

  return NextResponse.json({
    id: room.id,
    name: room.name,
    description: room.description,
    type: room.type,
    isPrivate: !!room.passwordHash,
    createdAt: room.createdAt,
  }, { status: 201 });
}
