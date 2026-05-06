import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer, CHANNELS, EVENTS } from "@/lib/pusher";
import { z } from "zod";

type Params = { params: Promise<{ projectId: string }> };

const createTaskSchema = z.object({
  roomId: z.string().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assigneeId: z.string().optional(),
  labelTag: z.string().max(30).optional(),
  deadline: z.string().datetime().nullable().optional(),
  isGlobal: z.boolean().default(true),
});

const updateTaskSchema = z.object({
  id: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.string().nullable().optional(),
  labelTag: z.string().nullable().optional(),
  title: z.string().min(1).max(200).optional(),
  position: z.number().optional(),
});

// GET /api/hub/[projectId]/tasks?roomId=xxx (or global if no roomId)
export async function GET(req: NextRequest, { params }: Params) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const tasks = await prisma.hubTask.findMany({
    where: roomId ? { roomId } : { projectId, isGlobal: true },
    orderBy: [{ status: "asc" }, { position: "asc" }],
    include: {
      room: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(tasks);
}

// POST /api/hub/[projectId]/tasks
export async function POST(req: NextRequest, { params }: Params) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { roomId, deadline, ...rest } = parsed.data;

  // Validate room belongs to project
  let resolvedRoomId = roomId;
  if (!roomId) {
    // Use global kanban room
    const kanbanRoom = await prisma.hubRoom.findFirst({ where: { projectId, type: "KANBAN" } });
    if (kanbanRoom) resolvedRoomId = kanbanRoom.id;
  }

  const lastTask = await prisma.hubTask.findFirst({
    where: roomId ? { roomId } : { projectId, isGlobal: true },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const task = await prisma.hubTask.create({
    data: {
      ...rest,
      projectId,
      roomId: resolvedRoomId ?? null,
      deadline: deadline ? new Date(deadline) : null,
      position: (lastTask?.position ?? -1) + 1,
    },
  });

  // Broadcast
  try {
    await pusherServer.trigger(CHANNELS.hub(projectId), EVENTS.HUB_TASK_CREATED, task);
  } catch {}

  // Notify assignee
  if (task.assigneeId && task.assigneeId !== session.user.id) {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { title: true } });
    await prisma.notification.create({
      data: {
        userId: task.assigneeId,
        title: "📌 Tugas Baru",
        message: `Kamu ditugaskan pada "${task.title}" di project ${project?.title || ""}`,
        type: "TASK",
        link: `/project/${projectId}/hub${task.roomId ? `?room=${task.roomId}` : ""}`,
      }
    });
    await pusherServer.trigger(CHANNELS.user(task.assigneeId), EVENTS.NEW_NOTIFICATION, {});
  }

  return NextResponse.json(task, { status: 201 });
}

// PATCH /api/hub/[projectId]/tasks
export async function PATCH(req: NextRequest, { params }: Params) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { id, ...updates } = parsed.data;

  const existingTask = await prisma.hubTask.findUnique({ where: { id } });
  const task = await prisma.hubTask.update({ where: { id }, data: updates });

  try {
    await pusherServer.trigger(CHANNELS.hub(projectId), EVENTS.HUB_TASK_UPDATED, task);
  } catch {}

  // Notify if assigned to someone new
  if (updates.assigneeId && updates.assigneeId !== existingTask?.assigneeId && updates.assigneeId !== session.user.id) {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { title: true } });
    await prisma.notification.create({
      data: {
        userId: updates.assigneeId,
        title: "📌 Tugas Baru",
        message: `Kamu ditugaskan pada "${task.title}" di project ${project?.title || ""}`,
        type: "TASK",
        link: `/project/${projectId}/hub${task.roomId ? `?room=${task.roomId}` : ""}`,
      }
    });
    await pusherServer.trigger(CHANNELS.user(updates.assigneeId), EVENTS.NEW_NOTIFICATION, {});
  }

  return NextResponse.json(task);
}
