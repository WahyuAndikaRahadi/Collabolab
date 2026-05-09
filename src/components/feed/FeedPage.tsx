"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FeedPostCard } from "./FeedPostCard";
import { CreatePostBox } from "./CreatePostBox";
import { CATEGORY_META, TOPIC_META } from "@/types";

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
    <div className="bg-grid" style={{ 
      minHeight: "100vh",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Shapes */}
      <div className="floating" style={{ position: "absolute", top: "10%", left: "5%", width: "60px", height: "60px", border: "4px solid #FFE500", borderRadius: "12px", zIndex: 0, opacity: 0.4 }}></div>
      <div className="floating-delayed" style={{ position: "absolute", top: "40%", right: "5%", width: "40px", height: "40px", background: "#00D37F", borderRadius: "50%", zIndex: 0, opacity: 0.3, border: "2px solid #000" }}></div>
      <div className="floating-fast" style={{ position: "absolute", bottom: "10%", left: "8%", width: "50px", height: "50px", border: "4px solid #FF4D4D", transform: "rotate(45deg)", zIndex: 0, opacity: 0.3 }}></div>

      <div style={{ 
        maxWidth: "1100px", 
        margin: "0 auto", 
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "40px",
        alignItems: "start",
        position: "relative",
        zIndex: 1
      }}>
        {/* Left Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Sidebar Card Container */}
          <div style={{
            background: "#fff",
            border: "3px solid #222",
            boxShadow: "6px 6px 0px #222",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {/* Home Button */}
            <motion.button 
              onClick={() => setFilter({})}
              whileHover={{ x: 6, background: "#f5f0e8" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: Object.keys(filter).length === 0 ? "#FFE500" : "transparent",
                color: "#222",
                border: "2px solid #222",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: "16px",
                fontFamily: "Space Grotesk, sans-serif",
                cursor: "pointer",
                boxShadow: Object.keys(filter).length === 0 ? "4px 4px 0px #222" : "2px 2px 0px #222",
                textAlign: "left",
                transition: "all 0.15s",
                width: "100%"
              }}
            >
              <span style={{ fontSize: "20px" }}>🏠</span> Beranda Feed
            </motion.button>

            {/* Category Filters - Category Meta */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", fontWeight: 900, color: "#444", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", background: "#FFE500", border: "1px solid #222" }}></span>
                KATEGORI EVENT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {Object.entries(CATEGORY_META).map(([key, meta]) => {
                  const isActive = filter.tag === meta.label;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => setFilter(isActive ? {} : { tag: meta.label })}
                      whileHover={{ x: 6, background: "#f5f0e8" }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        background: isActive ? "#F5F0E8" : "transparent",
                        color: isActive ? "#000" : "#555",
                        border: `2px solid ${isActive ? "#222" : "transparent"}`,
                        fontWeight: isActive ? 900 : 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        textAlign: "left",
                        borderRadius: "8px",
                        boxShadow: isActive ? `3px 3px 0px #FFE500` : "none",
                        fontFamily: "inherit",
                        transition: "all 0.15s"
                      }}
                    >
                      <span>{meta.emoji}</span> {meta.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Topic Filters - Topic Meta */}
            <div>
              <div style={{ fontSize: "11px", fontWeight: 900, color: "#444", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", background: "#00D37F", border: "1px solid #222" }}></span>
                TOPIK UTAMA
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
                {Object.entries(TOPIC_META).map(([key, meta]) => {
                  const isActive = filter.tag === meta.label;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => setFilter(isActive ? {} : { tag: meta.label })}
                      whileHover={{ x: 6, background: meta.color + "20", borderColor: meta.color }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        background: isActive ? meta.color + "20" : "transparent",
                        color: isActive ? meta.color : "#555",
                        border: `2px solid ${isActive ? meta.color : "#f0f0f0"}`,
                        fontWeight: isActive ? 900 : 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        textAlign: "left",
                        borderRadius: "8px",
                        boxShadow: isActive ? `3px 3px 0px ${meta.color}` : "none",
                        fontFamily: "inherit",
                        transition: "all 0.1s"
                      }}
                    >
                      <span style={{ color: meta.color, fontSize: "14px" }}>●</span> {meta.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Community Pulse - Decorative */}
          <motion.div 
            whileHover={{ y: -5 }}
            style={{
              background: "#1A1A2E",
              color: "#FFE500",
              padding: "16px",
              borderRadius: "12px",
              border: "2px solid #FFE500",
              boxShadow: "4px 4px 0px #1A1A2E"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "8px", height: "8px", background: "#00D37F", borderRadius: "50%", boxShadow: "0 0 8px #00D37F" }}></div>
              <span style={{ fontSize: "12px", fontWeight: 900 }}>COMMUNITY PULSE</span>
            </div>
            <p style={{ fontSize: "11px", fontWeight: 700, lineHeight: "1.4", opacity: 0.9 }}>
              12 Project baru ditambahkan hari ini! Jangan lewatkan kesempatan kolaborasi.
            </p>
          </motion.div>
        </motion.div>

        {/* Main Feed Content */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "22px"}}>

          <CreatePostBox user={user} onSuccess={() => fetchPosts(null, true)} />

          {/* Feed List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {posts.map((post, index) => {
              const isLast = posts.length === index + 1;
              return (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
                  ref={isLast ? lastPostElementRef : null}
                >
                  <FeedPostCard post={post} currentUserId={user?.id} />
                </motion.div>
              );
            })}
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div className="floating-fast" style={{ width: "30px", height: "30px", border: "4px solid #FFE500", borderTopColor: "transparent", borderRadius: "50%" }}></div>
              <div style={{ fontWeight: 900, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Menyelam lebih dalam...</div>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", padding: "80px 40px", background: "#F5F0E8", border: "3px dashed #000", borderRadius: "16px" }}
            >
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🌵</div>
              <div style={{ fontWeight: 900, fontSize: "24px", color: "#000", fontFamily: "Space Grotesk, sans-serif" }}>Sepi banget di sini...</div>
              <p style={{ color: "#555", fontSize: "16px", marginTop: "8px", fontWeight: 600 }}>Coba ganti filter atau jadilah yang pertama memposting!</p>
              <button 
                onClick={() => setFilter({})}
                className="btn-primary" 
                style={{ marginTop: "24px" }}
              >
                Reset Filter 🔄
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
