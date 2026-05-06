"use client";

import { useState, useEffect, useCallback } from "react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";
import { RoomSidebar } from "./RoomSidebar";
import { HubChat } from "./HubChat";
import { HubKanban } from "./HubKanban";
import { PresencePanel } from "./PresencePanel";
import { CreateRoomModal } from "./CreateRoomModal";
import { PasswordModal } from "./PasswordModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type HubRoom = {
  id: string;
  name: string;
  description: string | null;
  type: "ANNOUNCEMENT" | "GENERAL" | "KANBAN" | "CUSTOM";
  isPrivate: boolean;
  createdAt: string;
};

type Member = {
  id: string;
  userId: string;
  isAnonymous: boolean;
  anonymousTag: string | null;
  revealedAt: string | null;
  role: string;
  user: { id: string; name: string; image: string | null; trustScore: number; trustLevel: string };
};

type Project = {
  id: string;
  title: string;
  members: Member[];
  hubRooms: HubRoom[];
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function CollabHubClient({
  project: initialProject,
  currentUserId,
  isOwner,
  currentMember,
  initialRoomId,
}: {
  project: Project;
  currentUserId: string;
  isOwner: boolean;
  currentMember: Member;
  initialRoomId?: string;
}) {
  const [rooms, setRooms] = useState<HubRoom[]>(initialProject.hubRooms);
  const [activeRoom, setActiveRoom] = useState<HubRoom | null>(null);
  const [customTab, setCustomTab] = useState<"chat" | "kanban">("chat");
  const [unlockedRooms, setUnlockedRooms] = useState<Set<string>>(new Set());
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [passwordRoom, setPasswordRoom] = useState<HubRoom | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<{ [userId: string]: "online" | "away" | "offline" }>({});

  // Select initial room
  useEffect(() => {
    if (rooms.length === 0) return;
    if (initialRoomId) {
      const found = rooms.find((r) => r.id === initialRoomId);
      if (found) { handleSelectRoom(found); return; }
    }
    // Default: #general
    const general = rooms.find((r) => r.type === "GENERAL");
    if (general) handleSelectRoom(general);
    else setActiveRoom(rooms[0]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for new rooms via Pusher
  useEffect(() => {
    let pusher: ReturnType<typeof getPusherClient>;
    try {
      pusher = getPusherClient();
      const channel = pusher.subscribe(CHANNELS.hub(initialProject.id));
      channel.bind(EVENTS.HUB_ROOM_CREATED, (room: HubRoom) => {
        setRooms((prev) => {
          if (prev.find((r) => r.id === room.id)) return prev;
          return [...prev, room];
        });
      });
    } catch {}
    return () => {
      try { pusher?.unsubscribe(CHANNELS.hub(initialProject.id)); } catch {}
    };
  }, [initialProject.id]);

  function handleSelectRoom(room: HubRoom) {
    if (room.isPrivate && !unlockedRooms.has(room.id) && !isOwner) {
      setPasswordRoom(room);
      return;
    }
    setActiveRoom(room);
    setCustomTab("chat");
  }

  function handlePasswordSuccess() {
    if (!passwordRoom) return;
    setUnlockedRooms((prev) => new Set([...prev, passwordRoom.id]));
    setActiveRoom(passwordRoom);
    setPasswordRoom(null);
    setCustomTab("chat");
  }

  function handleRoomCreated(room: HubRoom) {
    setRooms((prev) => [...prev, room]);
    setActiveRoom(room);
    setCustomTab("chat");
  }

  const isKanbanRoom = activeRoom?.type === "KANBAN";
  const isCustomRoom = activeRoom?.type === "CUSTOM";
  const showKanban = isKanbanRoom || (isCustomRoom && customTab === "kanban");
  const showChat = !isKanbanRoom && (!isCustomRoom || customTab === "chat");

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* ─── Left: Room Sidebar ─── */}
      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoom?.id ?? null}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={() => setShowCreateRoom(true)}
        isOwner={isOwner}
        projectTitle={initialProject.title}
        unlockedRooms={unlockedRooms}
      />

      {/* ─── Center: Main Content ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {activeRoom ? (
          <>
            {/* Custom room: tab switcher (Chat / Kanban) */}
            {isCustomRoom && (
              <div style={{ background: "#FFFFFF", borderBottom: "3px solid #000000", display: "flex", flexShrink: 0 }}>
                {(["chat", "kanban"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`hub-custom-tab-${tab}`}
                    onClick={() => setCustomTab(tab)}
                    style={{
                      padding: "12px 20px",
                      background: customTab === tab ? "#FFE500" : "#FFFFFF",
                      color: customTab === tab ? "#000000" : "#3D3D3D",
                      border: "none",
                      borderRight: "3px solid #000000",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab === "chat" ? "💬 Chat" : "📋 Kanban"}
                  </button>
                ))}
              </div>
            )}

            {/* Chat */}
            {showChat && (
              <HubChat
                key={`chat-${activeRoom.id}`}
                projectId={initialProject.id}
                roomId={activeRoom.id}
                roomName={activeRoom.name}
                roomType={activeRoom.type}
                roomDescription={activeRoom.description}
                members={initialProject.members}
                onlineStatus={onlineStatus}
                currentUserId={currentUserId}
                currentMember={currentMember}
              />
            )}

            {/* Kanban */}
            {showKanban && (
              <HubKanban
                key={`kanban-${activeRoom.id}`}
                projectId={initialProject.id}
                roomId={isCustomRoom ? activeRoom.id : undefined}
                members={initialProject.members}
                currentUserId={currentUserId}
                isGlobal={isKanbanRoom}
              />
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
            <div style={{ textAlign: "center", color: "#3D3D3D" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤝</div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: "#000000" }}>
                Pilih room dari sidebar
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Right: Presence Panel ─── */}
      <PresencePanel
        projectId={initialProject.id}
        members={initialProject.members}
        currentUserId={currentUserId}
        onStatusChange={setOnlineStatus}
      />

      {/* ─── Modals ─── */}
      {showCreateRoom && (
        <CreateRoomModal
          projectId={initialProject.id}
          onCreated={handleRoomCreated}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
      {passwordRoom && (
        <PasswordModal
          projectId={initialProject.id}
          roomId={passwordRoom.id}
          roomName={passwordRoom.name}
          onSuccess={handlePasswordSuccess}
          onClose={() => setPasswordRoom(null)}
        />
      )}
    </div>
  );
}
