"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  user: any;
  onSuccess: () => void;
}

export function CreatePostBox({ user, onSuccess }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [type, setType] = useState<"CONTRIBUTION" | "EVENT">("CONTRIBUTION");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contribution specific
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [sdgTag, setSdgTag] = useState("");

  // Event specific
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("LOMBA");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventLink, setEventLink] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user.trustScore >= 20) {
      fetch("/api/users/me/projects?status=IN_PROGRESS")
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setProjects(data);
        });
    }
  }, [user]);

  // Click outside to collapse if empty
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        if (!content && !selectedProjectId && !eventName && !eventLink && !eventDeadline) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [content, selectedProjectId, eventName, eventLink, eventDeadline]);

  if (!user || user.trustScore < 20) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (type === "CONTRIBUTION" && !selectedProjectId) {
      return setError("Pilih project terlebih dahulu.");
    }
    if (type === "CONTRIBUTION" && !content.trim()) {
      return setError("Deskripsi wajib diisi.");
    }
    if (type === "EVENT" && (!eventName || !eventLink || !eventDeadline)) {
      return setError("Mohon isi semua field wajib event.");
    }
    if (type === "EVENT" && user.trustScore < 31) {
      return setError("Butuh Trust Score 31+ untuk memposting event");
    }

    setLoading(true);
    try {
      const payload = type === "CONTRIBUTION" 
        ? { type, projectId: selectedProjectId, content, sdgTag: sdgTag || null }
        : { type, content, eventName, eventCategory, eventDeadline, eventLink, sdgTag: sdgTag || null, eventSkills: [] };

      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        setContent("");
        setSelectedProjectId("");
        setEventName("");
        setEventLink("");
        setEventDeadline("");
        setSdgTag("");
        setIsExpanded(false);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal memposting.");
      }
    } catch {
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={boxRef}
      style={{
        background: "#FFFFFF",
        border: "2px solid #000000",
        boxShadow: "4px 4px 0px #000000",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {error && <div style={{ color: "#FF4D4D", fontSize: "14px", fontWeight: 700 }}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #000", background: "#FFE500", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "16px", flexShrink: 0 }}>
            {user.name?.[0] || "U"}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Apa yang sedang kamu pelajari? Gunakan # untuk tag bidang..."
            rows={isExpanded ? 3 : 1}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: "2px solid #000",
              borderRadius: "4px",
              background: "#F5F0E8",
              fontFamily: "inherit",
              fontSize: "15px",
              resize: "none",
              outline: "none",
              transition: "all 0.2s"
            }}
          />
        </div>

        {isExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px", paddingLeft: "52px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setType("CONTRIBUTION")}
                style={{
                  padding: "6px 12px",
                  background: type === "CONTRIBUTION" ? "#0047FF" : "#fff",
                  color: type === "CONTRIBUTION" ? "#fff" : "#000",
                  border: "2px solid #000",
                  borderRadius: "20px",
                  fontWeight: 800,
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: type === "CONTRIBUTION" ? "none" : "2px 2px 0px #000"
                }}
              >
                📢 Progress Project
              </button>
              <button
                type="button"
                onClick={() => setType("EVENT")}
                style={{
                  padding: "6px 12px",
                  background: type === "EVENT" ? "#00D37F" : "#fff",
                  color: type === "EVENT" ? "#000" : "#000",
                  border: "2px solid #000",
                  borderRadius: "20px",
                  fontWeight: 800,
                  fontSize: "12px",
                  cursor: "pointer",
                  boxShadow: type === "EVENT" ? "none" : "2px 2px 0px #000"
                }}
              >
                🏆 Info Event
              </button>
            </div>

            {type === "CONTRIBUTION" ? (
              <div>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  style={{ width: "100%", padding: "8px", border: "2px solid #000", borderRadius: "4px", background: "#F5F0E8", fontWeight: 700, fontSize: "13px" }}
                >
                  <option value="">-- Pilih Project Terkait --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {projects.length === 0 && (
                  <p style={{ fontSize: "11px", color: "#666", marginTop: "4px", fontWeight: 600 }}>Kamu harus bergabung dalam project yang sedang berjalan.</p>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "10px", padding: "12px", background: "#F5F0E8", border: "2px solid #000", borderRadius: "4px" }}>
                {user.trustScore < 31 ? (
                   <p style={{ fontSize: "12px", fontWeight: 700, color: "#FF4D4D" }}>Butuh Trust Score 31+ untuk membagikan event.</p>
                ) : (
                  <>
                    <input type="text" placeholder="Nama Event *" value={eventName} onChange={e => setEventName(e.target.value)} style={{ padding: "8px", border: "2px solid #000", borderRadius: "4px", fontSize: "13px", fontWeight: 600 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} style={{ padding: "8px", border: "2px solid #000", borderRadius: "4px", fontSize: "13px", fontWeight: 600 }}>
                        <option value="LOMBA">Lomba</option>
                        <option value="HACKATHON">Hackathon</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="SEMINAR">Seminar</option>
                        <option value="LAINNYA">Lainnya</option>
                      </select>
                      <input type="date" value={eventDeadline} onChange={e => setEventDeadline(e.target.value)} style={{ padding: "8px", border: "2px solid #000", borderRadius: "4px", fontSize: "13px", fontWeight: 600 }} />
                    </div>
                    <input type="url" placeholder="Link Pendaftaran *" value={eventLink} onChange={e => setEventLink(e.target.value)} style={{ padding: "8px", border: "2px solid #000", borderRadius: "4px", fontSize: "13px", fontWeight: 600 }} />
                  </>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
              <select
                value={sdgTag}
                onChange={(e) => setSdgTag(e.target.value)}
                style={{ padding: "6px 10px", border: "2px solid #000", borderRadius: "4px", background: "#fff", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
              >
                <option value="">Tanpa SDG Tag</option>
                <option value="SDG8">SDG 8: Decent Work</option>
                <option value="SDG9">SDG 9: Industry & Innovation</option>
                <option value="SDG12">SDG 12: Responsible Consumption</option>
              </select>

              <button
                type="submit"
                disabled={loading || (type === "EVENT" && user.trustScore < 31)}
                style={{
                  background: "#FFE500",
                  border: "2px solid #000",
                  padding: "8px 24px",
                  borderRadius: "4px",
                  fontWeight: 900,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0px #000",
                  transition: "all 0.1s"
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "1px 1px 0px #000"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0px #000"; }}
              >
                {loading ? "..." : "Share 🚀"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
