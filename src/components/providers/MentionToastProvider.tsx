"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";
import Link from "next/link";

type MentionNotif = {
  id: string;
  messageId: string;
  roomId: string;
  roomName: string;
  projectId: string;
  content: string;
  sender: { id: string; name: string };
};

export function MentionToastProvider() {
  const { data: session } = useSession();
  const [toasts, setToasts] = useState<MentionNotif[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    let pusher: ReturnType<typeof getPusherClient>;
    try {
      pusher = getPusherClient();
      const channel = pusher.subscribe(CHANNELS.user(session.user.id));
      channel.bind(EVENTS.MENTION, (payload: Omit<MentionNotif, "id">) => {
        const notif: MentionNotif = { ...payload, id: `${Date.now()}-${Math.random()}` };
        setToasts((prev) => [...prev.slice(-4), notif]); // max 5 toasts
        // Auto-dismiss after 6s
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== notif.id));
        }, 6000);
      });
    } catch {}

    return () => {
      try { pusher?.unsubscribe(CHANNELS.user(session.user.id)); } catch {}
    };
  }, [session?.user?.id]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxWidth: "360px",
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: "#fff",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: "4px 4px 0px #000",
            padding: "14px 16px",
            animation: "slideInRight 0.3s ease",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{
              background: "#0047FF",
              color: "#fff",
              borderRadius: "50%",
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 800,
              flexShrink: 0,
            }}>
              @
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "13px", color: "#000" }}>
                {toast.sender.name} menyebut kamu
              </div>
              <div style={{ fontSize: "11px", color: "#888" }}>di #{toast.roomName}</div>
            </div>
            <button
              onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "16px", padding: "0", flexShrink: 0 }}
            >
              ×
            </button>
          </div>
          <Link
            href={`/project/${toast.projectId}/hub?room=${toast.roomId}`}
            style={{ textDecoration: "none" }}
            onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))}
          >
            <div style={{
              background: "#F5F0E8",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "8px 10px",
              fontSize: "13px",
              color: "#3D3D3D",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              "{toast.content}"
            </div>
            <div style={{ marginTop: "6px", fontSize: "11px", color: "#0047FF", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>
              Buka pesan →
            </div>
          </Link>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
