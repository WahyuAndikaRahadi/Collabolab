"use client";

import { useState, useEffect } from "react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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
  roomId?: string;
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

// ─── SortableTask ─────────────────────────────────────────────────────────────
function SortableTask({
  task,
  getMemberName,
}: {
  task: HubTask;
  getMemberName: (id: string | null) => string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", status: task.status, task },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        background: "#FFFFFF",
        border: "3px solid #000000",
        borderLeft: `6px solid ${PRIORITY_COLOR[task.priority]}`,
        boxShadow: isDragging ? "1px 1px 0px #000" : "3px 3px 0px #000000",
        borderRadius: "6px",
        padding: "12px",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
    >
      <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "15px", margin: "0 0 8px", color: "#000000" }}>
        {task.title}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {task.labelTag && (
          <span style={{ background: "#F5F0E8", border: "1.5px solid #000000", borderRadius: "4px", fontSize: "11px", fontWeight: 800, padding: "1px 6px", color: "#000000", fontFamily: "JetBrains Mono, monospace" }}>
            {task.labelTag}
          </span>
        )}
        {task.assigneeId && (
          <span style={{ background: "#0047FF", border: "1.5px solid #000000", borderRadius: "4px", fontSize: "11px", fontWeight: 800, padding: "1px 6px", color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>
            👤 {getMemberName(task.assigneeId)}
          </span>
        )}
        <span style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: PRIORITY_COLOR[task.priority], display: "inline-block" }} />
      </div>
    </div>
  );
}

// ─── DroppableColumn ──────────────────────────────────────────────────────────
function DroppableColumn({
  col,
  colTasks,
  getMemberName,
  addingCol,
  newTitle,
  setNewTitle,
  setAddingCol,
  addTask,
}: {
  col: typeof COLS[number];
  colTasks: HubTask[];
  getMemberName: (id: string | null) => string | null;
  addingCol: string | null;
  newTitle: string;
  setNewTitle: (v: string) => void;
  setAddingCol: (v: string | null) => void;
  addTask: (status: HubTask["status"]) => void;
}) {
  // The column itself is the droppable target — id matches the status string
  const { setNodeRef, isOver } = useDroppable({
    id: col.status,
    data: { type: "column", status: col.status },
  });

  return (
    <div style={{ minWidth: "300px", maxWidth: "340px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: col.color, border: `3px solid ${col.accent}`, borderRadius: "8px", padding: "10px 14px", boxShadow: "4px 4px 0px #000000" }}>
        <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "15px", color: col.accent }}>{col.label}</span>
        <span style={{ background: col.accent, color: col.color, borderRadius: "4px", padding: "2px 8px", fontSize: "13px", fontWeight: 900 }}>{colTasks.length}</span>
      </div>

      {/* Sortable + droppable task list */}
      <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minHeight: "100px",
            padding: "4px",
            borderRadius: "8px",
            border: isOver ? "2px dashed #0047FF" : "2px dashed transparent",
            background: isOver ? "rgba(0,71,255,0.04)" : "transparent",
            transition: "all 0.15s ease",
          }}
        >
          {colTasks.map((task) => (
            <SortableTask key={task.id} task={task} getMemberName={getMemberName} />
          ))}
          {colTasks.length === 0 && !isOver && (
            <div style={{ textAlign: "center", color: "#AAAAAA", fontSize: "13px", fontWeight: 600, padding: "24px 0", fontFamily: "Space Grotesk, sans-serif" }}>
              Drag tasks here
            </div>
          )}
        </div>
      </SortableContext>

      {/* Add task */}
      {addingCol === col.status ? (
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask(col.status)}
            placeholder="Nama task..."
            style={{ flex: 1, background: "#FFFFFF", border: "3px solid #000000", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", fontWeight: 600, color: "#000000", outline: "none", boxShadow: "2px 2px 0px #000" }}
            autoFocus
          />
          <button onClick={() => addTask(col.status)} style={{ background: col.color, border: `2px solid #000000`, boxShadow: "2px 2px 0px #000", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", fontWeight: 900, color: "#000000", fontSize: "18px", lineHeight: 1 }}>+</button>
          <button onClick={() => setAddingCol(null)} style={{ background: "#FF4D4D", border: "2px solid #000000", boxShadow: "2px 2px 0px #000", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", color: "#000000", fontWeight: 900 }}>✕</button>
        </div>
      ) : (
        <button
          onClick={() => { setAddingCol(col.status); setNewTitle(""); }}
          style={{ background: "#F5F0E8", border: "3px dashed #000000", borderRadius: "6px", padding: "10px", color: "#000000", cursor: "pointer", fontSize: "14px", fontWeight: 800, width: "100%", fontFamily: "Space Grotesk, sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E3DA"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F0E8"; }}
        >
          + Tambah Task
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HubKanban({ projectId, roomId, members, currentUserId, isGlobal = true }: Props) {
  const [tasks, setTasks] = useState<HubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeTask, setActiveTask] = useState<HubTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    setLoading(true);
    const query = roomId ? `?roomId=${roomId}` : "";
    fetch(`/api/hub/${projectId}/tasks${query}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTasks(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, roomId]);

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

  async function patchTask(taskId: string, updates: { status?: HubTask["status"]; position?: number }) {
    await fetch(`/api/hub/${projectId}/tasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, ...updates }),
    });
  }

  async function addTask(status: HubTask["status"]) {
    if (!newTitle.trim()) return;
    await fetch(`/api/hub/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), status, projectId, roomId: roomId ?? undefined, isGlobal: !roomId }),
    });
    setNewTitle("");
    setAddingCol(null);
  }

  function handleDragStart(event: any) {
    const draggedTask = tasks.find((t) => t.id === event.active.id);
    if (draggedTask) setActiveTask(draggedTask);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    // Determine the target column status
    // over.data can be from a DroppableColumn (type:"column") or SortableTask (type:"task")
    const overData = over.data?.current as { type: string; status?: HubTask["status"] } | undefined;
    
    let targetStatus: HubTask["status"];
    if (overData?.type === "column") {
      targetStatus = overData.status!;
    } else if (overData?.type === "task") {
      targetStatus = overData.status!;
    } else {
      // Fallback: check if overId is a valid status
      const validStatuses: HubTask["status"][] = ["TODO", "IN_PROGRESS", "DONE"];
      targetStatus = validStatuses.includes(overId as HubTask["status"])
        ? (overId as HubTask["status"])
        : draggedTask.status;
    }

    if (draggedTask.status !== targetStatus) {
      // Move to different column
      setTasks((prev) => prev.map((t) => t.id === activeId ? { ...t, status: targetStatus } : t));
      patchTask(activeId, { status: targetStatus });
    } else if (activeId !== overId && overData?.type === "task") {
      // Reorder within same column
      setTasks((prev) => {
        const oldIdx = prev.findIndex((t) => t.id === activeId);
        const newIdx = prev.findIndex((t) => t.id === overId);
        return arrayMove(prev, oldIdx, newIdx);
      });
      const newIdx = tasks.findIndex((t) => t.id === overId);
      patchTask(activeId, { position: newIdx });
    }
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ flex: 1, background: "#FFFFFF", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: "3px solid #000000", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "18px", color: "#000000" }}>
            📋 {isGlobal ? "Kanban Board" : "Task Board"}
          </div>
          <div style={{ background: "#F5F0E8", border: "2px solid #000000", borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: 800, color: "#000000", fontFamily: "JetBrains Mono, monospace", boxShadow: "2px 2px 0px #000" }}>
            {tasks.length} task
          </div>
        </div>

        {/* Columns */}
        <div style={{ flex: 1, overflowX: "auto", padding: "20px", display: "flex", gap: "20px" }}>
          {COLS.map((col) => {
            const colTasks = tasks
              .filter((t) => t.status === col.status)
              .sort((a, b) => a.position - b.position);
            return (
              <DroppableColumn
                key={col.status}
                col={col}
                colTasks={colTasks}
                getMemberName={getMemberName}
                addingCol={addingCol}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                setAddingCol={setAddingCol}
                addTask={addTask}
              />
            );
          })}
        </div>

        {/* Drag overlay — ghost card that follows the cursor */}
        <DragOverlay>
          {activeTask ? (
            <div style={{
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderLeft: `6px solid ${PRIORITY_COLOR[activeTask.priority]}`,
              boxShadow: "8px 8px 0px #000000",
              borderRadius: "6px",
              padding: "12px",
              opacity: 0.95,
              cursor: "grabbing",
              width: "300px",
              rotate: "2deg",
            }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "15px", margin: "0 0 8px", color: "#000000" }}>
                {activeTask.title}
              </p>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {activeTask.labelTag && (
                  <span style={{ background: "#F5F0E8", border: "1.5px solid #000000", borderRadius: "4px", fontSize: "11px", fontWeight: 800, padding: "1px 6px" }}>
                    {activeTask.labelTag}
                  </span>
                )}
                <span style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: PRIORITY_COLOR[activeTask.priority] }} />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

