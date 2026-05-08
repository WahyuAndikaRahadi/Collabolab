"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FeedPostCard } from "./FeedPostCard";
import { CreatePostBox } from "./CreatePostBox";

interface Props {
  user: any;
}

export function FeedPage({ user }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ type?: string; topic?: string; tag?: string }>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor) {
        fetchPosts(nextCursor);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, nextCursor]);

  const fetchPosts = async (cursor: string | null = null, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (filter.type) params.set("type", filter.type);
      if (filter.topic) params.set("topic", filter.topic);
      if (filter.tag) params.set("tag", filter.tag);

      const res = await fetch(`/api/feed?${params.toString()}`);
      const data = await res.json();

      if (data.posts) {
        setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
        setNextCursor(data.nextCursor);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(null, true);
  }, [filter]);

  return (
    <div style={{ 
      maxWidth: "1100px", 
      margin: "0 auto", 
      padding: "24px 16px",
      display: "grid",
      gridTemplateColumns: "250px 1fr",
      gap: "32px",
      alignItems: "start"
    }}>
      {/* Left Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Home Button */}
        <motion.button
          onClick={() => setFilter({})}
          whileHover={{ x: 3, boxShadow: "4px 4px 0px #000" }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: Object.keys(filter).length === 0 ? "#FFE500" : "#F5F0E8",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "12px 16px",
            fontWeight: 900,
            fontSize: "15px",
            fontFamily: "Space Grotesk, sans-serif",
            cursor: "pointer",
            boxShadow: Object.keys(filter).length === 0 ? "4px 4px 0px #000" : "2px 2px 0px #000",
            textAlign: "left",
            transition: "all 0.15s"
          }}
        >
          <span style={{ fontSize: "18px" }}>🏠</span> Semua Post
        </motion.button>

        {/* Type Filters */}
        <div>
          <div style={{ fontSize: "10px", fontWeight: 900, color: "#888", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", paddingLeft: "4px" }}>TIPE POST</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "📢 Contribution", value: { type: "CONTRIBUTION" }, color: "#0047FF", bg: "#E6F0FF" },
              { label: "🏆 Event", value: { type: "EVENT" }, color: "#FF4D4D", bg: "#FFE8E8" },
            ].map((f, i) => {
              const isActive = JSON.stringify(filter) === JSON.stringify(f.value);
              return (
                <motion.button
                  key={f.label}
                  onClick={() => setFilter(f.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4, boxShadow: `3px 3px 0px ${f.color}` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 12px",
                    background: isActive ? f.bg : "#fff",
                    color: isActive ? f.color : "#444",
                    border: `2px solid ${isActive ? f.color : "#ddd"}`,
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: "8px",
                    boxShadow: isActive ? `3px 3px 0px ${f.color}` : "none",
                    fontFamily: "inherit",
                    transition: "all 0.15s"
                  }}
                >
                  {f.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <div style={{ fontSize: "10px", fontWeight: 900, color: "#888", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", paddingLeft: "4px" }}>BIDANG & TAG</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "React", value: { tag: "React" }, color: "#61DAFB", bg: "#E8FAFE", emoji: "⚛️" },
              { label: "UI/UX", value: { tag: "UIUX" }, color: "#FF6B6B", bg: "#FFE8E8", emoji: "🎨" },
              { label: "Akademik", value: { tag: "Akademik" }, color: "#0047FF", bg: "#E6F0FF", emoji: "📖" },
              { label: "Bisnis", value: { tag: "Bisnis" }, color: "#00D37F", bg: "#E0FFF4", emoji: "📊" },
              { label: "Pertanian", value: { tag: "Pertanian" }, color: "#E67E22", bg: "#FFF3E0", emoji: "🚜" },
              { label: "Riset", value: { tag: "Riset" }, color: "#9B59B6", bg: "#F3E8FF", emoji: "🔬" },
              { label: "Marketing", value: { tag: "Marketing" }, color: "#FF4D8D", bg: "#FFE8F2", emoji: "📣" },
            ].map((f, i) => {
              const isActive = JSON.stringify(filter) === JSON.stringify(f.value);
              return (
                <motion.button
                  key={f.label}
                  onClick={() => setFilter(f.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  whileHover={{ x: 4, boxShadow: `3px 3px 0px ${f.color}` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: isActive ? f.bg : "#fff",
                    color: isActive ? f.color : "#555",
                    border: `2px solid ${isActive ? f.color : "#e8e8e8"}`,
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: "8px",
                    boxShadow: isActive ? `3px 3px 0px ${f.color}` : "none",
                    fontFamily: "inherit",
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{f.emoji}</span>
                  {f.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Topic Filters */}
        <div>
          <div style={{ fontSize: "10px", fontWeight: 900, color: "#888", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", paddingLeft: "4px" }}>TOPIK UTAMA</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Teknologi", value: { topic: "TEKNOLOGI" }, color: "#0047FF", bg: "#E6F0FF", emoji: "💻" },
              { label: "Pertanian", value: { topic: "PERTANIAN" }, color: "#00D37F", bg: "#E0FFF4", emoji: "🚜" },
              { label: "Ekonomi", value: { topic: "EKONOMI" }, color: "#FF4D4D", bg: "#FFE8E8", emoji: "📈" },
              { label: "Karya Tulis", value: { topic: "KARYA_TULIS" }, color: "#BF8B2E", bg: "#FFF9E0", emoji: "✍️" },
            ].map((f, i) => {
              const isActive = JSON.stringify(filter) === JSON.stringify(f.value);
              return (
                <motion.button
                  key={f.label}
                  onClick={() => setFilter(f.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38 + i * 0.04 }}
                  whileHover={{ x: 4, boxShadow: `3px 3px 0px ${f.color}` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: isActive ? f.bg : "#fff",
                    color: isActive ? f.color : "#555",
                    border: `2px solid ${isActive ? f.color : "#e8e8e8"}`,
                    fontWeight: 800,
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: "8px",
                    boxShadow: isActive ? `3px 3px 0px ${f.color}` : "none",
                    fontFamily: "inherit",
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: "13px" }}>{f.emoji}</span>
                  {f.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Feed Content */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        
        <CreatePostBox user={user} onSuccess={() => fetchPosts(null, true)} />

        {/* Feed List */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostElementRef} key={post.id}>
                  <FeedPostCard post={post} currentUserId={user?.id} />
                </div>
              );
            }
            return <FeedPostCard key={post.id} post={post} currentUserId={user?.id} />;
          })}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px", fontWeight: 800 }}>Memuat konten...</div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#F5F0E8", border: "2px dashed #000", borderRadius: "8px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontWeight: 800, fontSize: "18px", color: "#000" }}>Belum ada konten yang cocok.</div>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>Coba ganti filter atau bagikan sesuatu!</p>
          </div>
        )}
      </div>
    </div>
  );
}
