"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";
import { useToast } from "@/lib/toast";

type MentionNotif = {
  id: string;
  messageId: string;
  roomId: string;
  roomName: string;
  projectId: string;
  content: string;
  sender: { id: string; name: string };
  projectTitle?: string;
};

export function MentionToastProvider() {
  const { data: session } = useSession();
  const toast = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;
    let pusher: ReturnType<typeof getPusherClient>;
    
    try {
      pusher = getPusherClient();
      const channel = pusher.subscribe(CHANNELS.user(session.user.id));
      
      channel.bind(EVENTS.MENTION, (payload: MentionNotif) => {
        toast.mention(
          payload.sender.name,
          `#${payload.roomName}`,
          payload.projectTitle || "Project",
          `/project/${payload.projectId}/hub?room=${payload.roomId}`
        );
      });
    } catch (err) {
      console.error("MentionToast Error:", err);
    }

    return () => {
      try { pusher?.unsubscribe(CHANNELS.user(session.user.id)); } catch {}
    };
  }, [session?.user?.id, toast]);

  return null;
}
