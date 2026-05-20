import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient() can only be called on the client side");
  }

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });
  }

  return pusherClientInstance;
}

export const CHANNELS = {
  project: (projectId: string) => `private-project-${projectId}`,
  presence: (projectId: string) => `presence-project-${projectId}`,
  user: (userId: string) => `private-user-${userId}`,
  hub: (projectId: string) => `private-hub-${projectId}`,
  hubRoom: (roomId: string) => `private-hubroom-${roomId}`,
  hubPresence: (projectId: string) => `presence-hub-${projectId}`,
} as const;

export const EVENTS = {
  NEW_MESSAGE: "new-message",
  TASK_UPDATED: "task-updated",
  TASK_CREATED: "task-created",
  TASK_DELETED: "task-deleted",
  POLL_VOTE: "poll-vote",
  NEW_APPLICATION: "new-application",
  APPLICATION_DECISION: "application-decision",
  NEW_POLL: "new-poll",
  POLL_UPDATED: "poll-updated",
  HUB_MESSAGE: "hub-message",
  HUB_TASK_UPDATED: "hub-task-updated",
  HUB_TASK_CREATED: "hub-task-created",
  HUB_ROOM_CREATED: "hub-room-created",
  MENTION: "mention",
  NEW_NOTIFICATION: "new-notification",
  MESSAGE_DELETED: "message-deleted",
  MEMBER_KICKED: "member-kicked",
  IDENTITY_REVEALED: "identity-revealed",
} as const;
