"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREDEFINED_TAGS = [
  "Frontend", "Backend", "Design", "Research", "Business", "Marketing", "Writing", 
  "Engineering", "Management", "Education", "Agrotech", "Finance", "Creative"
];

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
  const [projectTopic, setProjectTopic] = useState("");

  // Event specific
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("LOMBA");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventLink, setEventLink] = useState("");

  // Hashtag autocomplete
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTagSearch, setActiveTagSearch] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Mention autocomplete
  const [mentionedUsers, setMentionedUsers] = useState<{ id: string; name: string }[]>([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<{ id: string; name: string; trustLevel: string }[]>([]);
  const [activeTrigger, setActiveTrigger] = useState<"#" | "@" | null>(null);

  useEffect(() => {
    if (user && user.trustScore >= 20) {
      fetch("/api/users/me/projects")
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setProjects(data);
        })
        .catch(err => console.error("Failed to fetch projects", err));
    }
  }, [user, isExpanded]);

  // Click outside to collapse if empty
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        if (!content && !selectedProjectId && !eventName && !eventLink && !eventDeadline) {
          setIsExpanded(false);
          setShowSuggestions(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [content, selectedProjectId, eventName, eventLink, eventDeadline]);

  // Handle typing and cursor for hashtags
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    checkHashtag(e.target);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    checkHashtag(e.currentTarget);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    checkHashtag(e.currentTarget);
  };

  const checkHashtag = (target: HTMLTextAreaElement) => {
    const pos = target.selectionStart;
    const textBeforeCursor = target.value.slice(0, pos);

    // Check for @mention first
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      setMentionSearch(mentionMatch[1]);
      setCursorPosition(pos);
      setActiveTrigger("@");
      setShowSuggestions(false);
      return;
    }

    // Then check for hashtag
    const hashMatch = textBeforeCursor.match(/#(\w*)$/);
    if (hashMatch) {
      setActiveTagSearch(hashMatch[1]);
      setCursorPosition(pos);
      setActiveTrigger("#");
      setShowMentionSuggestions(false);
      setShowSuggestions(true);
    } else {
      setActiveTrigger(null);
      setShowSuggestions(false);
      setShowMentionSuggestions(false);
    }
  };

  // Fetch mention suggestions when mentionSearch changes
  useEffect(() => {
    if (activeTrigger !== "@" || mentionSearch.length < 1) {
      setShowMentionSuggestions(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionSearch)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMentionSuggestions(data);
          setShowMentionSuggestions(data.length > 0);
        }
      } catch { }
    }, 200);
    return () => clearTimeout(t);
  }, [mentionSearch, activeTrigger]);

  const handleTagSelect = (tag: string) => {
    if (cursorPosition === null || !textareaRef.current) return;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const newTextBeforeCursor = textBeforeCursor.replace(/#\w*$/, `#${tag} `);
    setContent(newTextBeforeCursor + textAfterCursor);
    setShowSuggestions(false);
    setActiveTrigger(null);
    textareaRef.current.focus();
  };

  const handleMentionSelect = (user: { id: string; name: string }) => {
    if (cursorPosition === null || !textareaRef.current) return;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    // Use @[Name] format to support multi-word names
    const newTextBeforeCursor = textBeforeCursor.replace(/@\w*$/, `@[${user.name}] `);
    setContent(newTextBeforeCursor + textAfterCursor);
    setMentionedUsers((prev) => [...prev.filter((u) => u.id !== user.id), { id: user.id, name: user.name }]);
    setShowMentionSuggestions(false);
    setActiveTrigger(null);
    textareaRef.current.focus();
  };

  const highlightText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(@\[[^\]]+\]|#\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@[") && part.endsWith("]")) {
        // Show as @Name without the brackets
        const name = part.slice(2, -1);
        return <span key={i} style={{ color: "#00D37F", fontWeight: 800 }}>@{name}</span>;
      }
      if (part.startsWith("#")) return <span key={i} style={{ color: "#0047FF", fontWeight: 800 }}>{part}</span>;
      // Plain text must be black because textarea underneath is transparent
      return <span key={i} style={{ color: "#000" }}>{part}</span>;
    });
  };

  const filteredTags = PREDEFINED_TAGS.filter(t => t.toLowerCase().includes(activeTagSearch.toLowerCase()));

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
        ? { type, projectId: selectedProjectId, content, projectTopic: projectTopic || null, mentions: mentionedUsers.map(u => u.id) }
        : { type, content, eventName, eventCategory, eventDeadline, eventLink, projectTopic: projectTopic || null, eventSkills: [], mentions: mentionedUsers.map(u => u.id) };

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
        setProjectTopic("");
        setMentionedUsers([]);
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={boxRef}
      style={{
        background: "#FFFFFF",
        border: "3px solid #000000",
        boxShadow: "6px 6px 0px #000000",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "32px",
        position: "relative",
        zIndex: 10
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {error && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ color: "#FF4D4D", fontSize: "14px", fontWeight: 700 }}>⚠️ {error}</motion.div>}

        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #000", background: "#FFE500", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", flexShrink: 0, boxShadow: "2px 2px 0px #000" }}>
            {user.name?.[0] || "U"}
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <div style={{
              position: "relative",
              border: "2px solid #000",
              borderRadius: "4px",
              background: "#F5F0E8",
              boxShadow: isExpanded ? "4px 4px 0px #000" : "2px 2px 0px #000",
              transition: "all 0.2s",
            }}>
              {/* Highlight Overlay — sits above textarea, shows colored markup */}
              <div style={{
                position: "absolute",
                inset: 0,
                padding: "10px 14px",
                pointerEvents: "none",
                fontFamily: "inherit",
                fontSize: "15px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                color: "transparent", 
                zIndex: 2,
                overflow: "hidden",
              }}>
                {content ? highlightText(content) : (
                  <span style={{ color: "#666", opacity: 0.7 }}>Apa yang sedang kamu pelajari? Gunakan # untuk tag bidang...</span>
                )}
              </div>

              {/* Actual Textarea — text is transparent so overlay shows through */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onMouseUp={handleMouseUp}
                onFocus={() => setIsExpanded(true)}
                rows={isExpanded ? 3 : 1}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  color: "transparent",
                  fontFamily: "inherit",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  resize: "none",
                  outline: "none",
                  caretColor: "#000",
                  display: "block",
                  position: "relative",
                  zIndex: 1
                }}
              />
            </div>

            {/* Hashtag Suggestions */}
            <AnimatePresence>
              {showSuggestions && filteredTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    marginTop: "8px",
                    width: "250px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#FFFFFF",
                    border: "2px solid #000",
                    borderRadius: "4px",
                    boxShadow: "4px 4px 0px #000",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ padding: "8px 12px", fontSize: "12px", fontWeight: 900, borderBottom: "2px solid #000", background: "#F5F0E8" }}>SUGGESTED TAGS</div>
                  {filteredTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#E6F0FF"; e.currentTarget.style.color = "#0047FF"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        background: "#fff",
                        border: "none",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: "14px",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ color: "#999" }}>#</span> {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mention Suggestions */}
            <AnimatePresence>
              {showMentionSuggestions && mentionSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    marginTop: "8px",
                    width: "260px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#FFFFFF",
                    border: "2px solid #000",
                    borderRadius: "4px",
                    boxShadow: "4px 4px 0px #000",
                    zIndex: 21,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ padding: "8px 12px", fontSize: "12px", fontWeight: 900, borderBottom: "2px solid #000", background: "#E6FFE6" }}>MENTION USER</div>
                  {mentionSuggestions.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onMouseDown={() => handleMentionSelect(user)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#E6FFE6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        background: "#fff",
                        border: "none",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "14px",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ color: "#00D37F", fontWeight: 900 }}>@</span> {user.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", paddingLeft: "56px" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setType("CONTRIBUTION")}
                    style={{
                      padding: "8px 16px",
                      background: type === "CONTRIBUTION" ? "#0047FF" : "#fff",
                      color: type === "CONTRIBUTION" ? "#fff" : "#000",
                      border: "2px solid #000",
                      borderRadius: "20px",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      boxShadow: type === "CONTRIBUTION" ? "none" : "3px 3px 0px #000",
                      transition: "all 0.1s"
                    }}
                  >
                    📢 Progress Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("EVENT")}
                    style={{
                      padding: "8px 16px",
                      background: type === "EVENT" ? "#00D37F" : "#fff",
                      color: type === "EVENT" ? "#000" : "#000",
                      border: "2px solid #000",
                      borderRadius: "20px",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                      boxShadow: type === "EVENT" ? "none" : "3px 3px 0px #000",
                      transition: "all 0.1s"
                    }}
                  >
                    🏆 Info Event
                  </button>
                </div>

                {type === "CONTRIBUTION" ? (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      style={{ width: "100%", padding: "10px", border: "2px solid #000", borderRadius: "4px", background: "#F5F0E8", fontWeight: 700, fontSize: "14px", outline: "none", cursor: "pointer" }}
                    >
                      <option value="">-- Pilih Project Terkait --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    {projects.length === 0 && (
                      <p style={{ fontSize: "12px", color: "#666", marginTop: "6px", fontWeight: 600 }}>Kamu harus bergabung dalam project yang sedang berjalan.</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "grid", gap: "12px", padding: "16px", background: "#F5F0E8", border: "2px solid #000", borderRadius: "4px" }}>
                    {user.trustScore < 31 ? (
                      <p style={{ fontSize: "13px", fontWeight: 800, color: "#FF4D4D", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "18px" }}>🔒</span> Butuh Trust Score 31+ untuk membagikan event.
                      </p>
                    ) : (
                      <>
                        <input type="text" placeholder="Nama Event *" value={eventName} onChange={e => setEventName(e.target.value)} style={{ padding: "10px", border: "2px solid #000", borderRadius: "4px", fontSize: "14px", fontWeight: 600, outline: "none" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} style={{ padding: "10px", border: "2px solid #000", borderRadius: "4px", fontSize: "14px", fontWeight: 600, outline: "none", background: "#fff", cursor: "pointer" }}>
                            <option value="LOMBA">Lomba</option>
                            <option value="HACKATHON">Hackathon</option>
                            <option value="WORKSHOP">Workshop</option>
                            <option value="SEMINAR">Seminar</option>
                            <option value="ESSAY_AKADEMIK">Esai / Akademik</option>
                            <option value="BISNIS_UMKM">Bisnis / UMKM</option>
                            <option value="LAINNYA">Lainnya</option>
                          </select>
                          <input type="date" value={eventDeadline} onChange={e => setEventDeadline(e.target.value)} style={{ padding: "10px", border: "2px solid #000", borderRadius: "4px", fontSize: "14px", fontWeight: 600, outline: "none" }} />
                        </div>
                        <input type="url" placeholder="Link Pendaftaran *" value={eventLink} onChange={e => setEventLink(e.target.value)} style={{ padding: "10px", border: "2px solid #000", borderRadius: "4px", fontSize: "14px", fontWeight: 600, outline: "none" }} />
                      </>
                    )}
                  </motion.div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                  <select
                    value={projectTopic}
                    onChange={(e) => setProjectTopic(e.target.value)}
                    style={{ padding: "8px 12px", border: "2px solid #000", borderRadius: "4px", background: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">🔖 Pilih Topik</option>
                    <option value="TEKNOLOGI">💻 Teknologi</option>
                    <option value="PERTANIAN">🚜 Pertanian</option>
                    <option value="PENDIDIKAN">📚 Pendidikan</option>
                    <option value="EKONOMI">📈 Ekonomi</option>
                    <option value="KARYA_TULIS">✍️ Karya Tulis</option>
                    <option value="RESEARCH">🔬 Research</option>
                    <option value="SENI_BUDAYA">🎨 Seni Budaya</option>
                    <option value="HUKUM_POLITIK">⚖️ Hukum & Politik</option>
                    <option value="MANUFAKTUR">⚙️ Manufaktur</option>
                    <option value="KULINER_PARIWISATA">🍳 Kuliner & Tour</option>
                    <option value="OLAHRAGA_KEBUGARAN">⚽ Olahraga</option>
                    <option value="MARITIM_DIRGANTARA">🚀 Maritim & Udara</option>
                    <option value="SAINS_MURNI">🧪 Sains Murni</option>
                  </select>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95, y: 2, boxShadow: "1px 1px 0px #000" }}
                    type="submit"
                    disabled={loading || (type === "EVENT" && user.trustScore < 31)}
                    style={{
                      background: "#FFE500",
                      border: "2px solid #000",
                      padding: "10px 28px",
                      borderRadius: "4px",
                      fontWeight: 900,
                      fontSize: "15px",
                      cursor: "pointer",
                      boxShadow: "4px 4px 0px #000",
                    }}
                  >
                    {loading ? "Memproses..." : "Share 🚀"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
