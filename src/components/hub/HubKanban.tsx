"use client";

import { useState, useEffect } from "react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";

type HubTask = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  labelTag: string | null;
  deadline: string | null;
  position: number;
  isGlobal: boolean;
};

type Member = {
  userId: string;
  isAnonymous: boolean;
  anonymousTag: string | null;
  revealedAt: string | null;
  user: { id: string; name: string };
};

type Props = {
  projectId: string;
  roomId?: string; // undefined = global kanban
  members: Member[];
  currentUserId: string;
  isGlobal?: boolean;
};

const COLS: { status: HubTask["status"]; label: string; color: string; accent: string }[] = [
  { status: "TODO", label: "📝 To Do", color: "#F5F0E8", accent: "#000000" },
  { status: "IN_PROGRESS", label: "⚡ In Progress", color: "#FFE500", accent: "#000000" },
  { status: "DONE", label: "✅ Done", color: "#00D37F", accent: "#000000" },
];

const PRIORITY_COLOR: Record<HubTask["priority"], string> = {
  LOW: "#00D37F",
  MEDIUM: "#FFE500",
  HIGH: "#FF4D4D",
};

export function HubKanban({ projectId, roomId, members, currentUserId, isGlobal = true }: Props) {
  const [tasks, setTasks] = useState<HubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Load tasks
  useEffect(() => {
    setLoading(true);
    const query = roomId ? `?roomId=${roomId}` : "";
    fetch(`/api/hub/${projectId}/tasks${query}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTasks(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, roomId]);

  // Pusher sync
  useEffect(() => {
    let pusher: ReturnType<typeof getPusherClient>;
    try {
      pusher = getPusherClient();
      const channel = pusher.subscribe(CHANNELS.hub(projectId));
      channel.bind(EVENTS.HUB_TASK_UPDATED, (task: HubTask) => {
        setTasks((prev) => prev.map((t) => t.id === task.id ? task : t));
      });
      channel.bind(EVENTS.HUB_TASK_CREATED, (task: HubTask) => {
        setTasks((prev) => {
          if (prev.find((t) => t.id === task.id)) return prev;
          return [...prev, task];
        });
      });
    } catch {}
    return () => {
      try { pusher?.unsubscribe(CHANNELS.hub(projectId)); } catch {}
    };
  }, [projectId]);

  async function moveTask(taskId: string, newStatus: HubTask["status"]) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    await fetch(`/api/hub/${projectId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, status: newStatus }),
    });
  }

  async function addTask(status: HubTask["status"]) {
    if (!newTitle.trim()) return;
    await fetch(`/api/hub/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        status,
        projectId,
        roomId: roomId ?? undefined,
        isGlobal: !roomId,
      }),
    });
    setNewTitle("");
    setAddingCol(null);
  }

  const getMemberName = (userId: string | null) => {
    if (!userId) return null;
    const m = members.find((m) => m.userId === userId);
    if (!m) return null;
    if (m.isAnonymous && !m.revealedAt) return `Anon#${m.anonymousTag || "0000"}`;
    return m.user.name;
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", color: "#3D3D3D", fontWeight: 800 }}>
        Memuat kanban...
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: "#FFFFFF", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "3px solid #000000", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "18px", color: "#000000" }}>
          📋 {isGlobal ? "Kanban Board" : "Task Board"}
        </div>
        <div style={{
          background: "#F5F0E8",
          border: "2px solid #000000",
          borderRadius: "20px",
          padding: "3px 10px",
          fontSize: "12px",
          fontWeight: 800,
          color: "#000000",
          fontFamily: "JetBrains Mono, monospace",
          boxShadow: "2px 2px 0px #000",
        }}>
          {tasks.length} task
        </div>
      </div>

      {/* Columns */}
      <div style={{ flex: 1, overflowX: "auto", padding: "20px", display: "flex", gap: "16px" }}>
        {COLS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} style={{ minWidth: "300px", maxWidth: "340px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Column header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: col.color, border: `3px solid ${col.accent}`,
                borderRadius: "8px", padding: "10px 14px",
                boxShadow: "4px 4px 0px #000000",
              }}>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "15px", color: col.accent }}>
                  {col.label}
                </span>
                <span style={{
                  background: col.accent, color: col.color,
                  borderRadius: "4px", padding: "2px 8px",
                  fontSize: "13px", fontWeight: 900,
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "80px" }}>
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`hub-task-${task.id}`}
                    style={{
                      background: "#FFFFFF",
                      border: "3px solid #000000",
                      borderLeft: `6px solid ${PRIORITY_COLOR[task.priority]}`,
                      boxShadow: "3px 3px 0px #000000",
                      borderRadius: "6px",
                      padding: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = "5px 5px 0px #000"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0px #000"; }}
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  >
                    <p style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 800, fontSize: "15px",
                      margin: "0 0 8px", color: "#000000",
                    }}>
                      {task.title}
                    </p>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: expandedTask === task.id ? "10px" : "0" }}>
                      {task.labelTag && (
                        <span style={{
                          background: "#F5F0E8", border: "1.5px solid #000000",
                          borderRadius: "4px", fontSize: "11px", fontWeight: 800,
                          padding: "1px 6px", color: "#000000",
                          fontFamily: "JetBrains Mono, monospace",
                        }}>
                          {task.labelTag}
                        </span>
                      )}
                      {task.assigneeId && (
                        <span style={{
                          background: "#0047FF", border: "1.5px solid #000000",
                          borderRadius: "4px", fontSize: "11px", fontWeight: 800,
                          padding: "1px 6px", color: "#FFFFFF",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}>
                          👤 {getMemberName(task.assigneeId)}
                        </span>
                      )}
                      <span style={{
                        marginLeft: "auto",
                        width: "8px", height: "8px",
                        borderRadius: "50%",
                        background: PRIORITY_COLOR[task.priority],
                        display: "inline-block",
                        alignSelf: "center",
                      }} title={`Prioritas: ${task.priority}`} />
                    </div>

                    {/* Expanded actions */}
                    {expandedTask === task.id && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px", borderTop: "2px solid #E8E3DA", paddingTop: "10px" }}>
                        {col.status !== "TODO" && (
                          <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "TODO"); }} style={{ background: "#F5F0E8", border: "2px solid #000000", boxShadow: "2px 2px 0px #000", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", cursor: "pointer", color: "#000000", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                            ← To Do
                          </button>
                        )}
                        {col.status !== "IN_PROGRESS" && (
                          <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "IN_PROGRESS"); }} style={{ background: "#FFE500", border: "2px solid #000000", boxShadow: "2px 2px 0px #000", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", cursor: "pointer", color: "#000000", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                            ⚡ In Progress
                          </button>
                        )}
                        {col.status !== "DONE" && (
                          <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "DONE"); }} style={{ background: "#00D37F", border: "2px solid #000000", boxShadow: "2px 2px 0px #000", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", cursor: "pointer", color: "#000000", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
                            ✓ Done
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add task input */}
                {addingCol === col.status ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask(col.status)}
                      id={`hub-add-task-input-${col.status}`}
                      placeholder="Nama task..."
                      style={{
                        flex: 1, background: "#FFFFFF",
                        border: "3px solid #000000", borderRadius: "6px",
                        padding: "8px 12px", fontSize: "14px", fontWeight: 600,
                        color: "#000000", outline: "none", boxShadow: "2px 2px 0px #000",
                      }}
                      autoFocus
                    />
                    <button onClick={() => addTask(col.status)} style={{ background: col.color, border: `2px solid #000000`, boxShadow: "2px 2px 0px #000", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", fontWeight: 900, color: "#000000", fontSize: "18px", lineHeight: 1 }}>+</button>
                    <button onClick={() => setAddingCol(null)} style={{ background: "#FF4D4D", border: "2px solid #000000", boxShadow: "2px 2px 0px #000", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", color: "#000000", fontWeight: 900 }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingCol(col.status); setNewTitle(""); }}
                    id={`hub-add-task-btn-${col.status}`}
                    style={{
                      background: "#F5F0E8",
                      border: "3px dashed #000000",
                      borderRadius: "6px",
                      padding: "10px",
                      color: "#000000",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 800,
                      width: "100%",
                      transition: "all 0.15s",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E3DA"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F0E8"; }}
                  >
                    + Tambah Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
