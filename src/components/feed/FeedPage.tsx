"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FeedPostCard } from "./FeedPostCard";
import { CreatePostBox } from "./CreatePostBox";

interface Props {
  user: any;
}

export function FeedPage({ user }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ type?: string; sdg?: string; tag?: string }>({});

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
      if (filter.sdg) params.set("sdg", filter.sdg);
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
      <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <button
          onClick={() => setFilter({})}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: Object.keys(filter).length === 0 ? "#E6F0FF" : "#F5F0E8",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "12px 16px",
            fontWeight: 900,
            fontSize: "15px",
            fontFamily: "Space Grotesk, sans-serif",
            cursor: "pointer",
            boxShadow: "2px 2px 0px #000",
            textAlign: "left"
          }}
        >
          <span style={{ fontSize: "18px" }}>🏠</span> Home
        </button>

        <div>
          <div style={{ fontSize: "12px", fontWeight: 900, color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", marginLeft: "4px" }}>BIDANG & TAG</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Contribution", value: { type: "CONTRIBUTION" } },
              { label: "Event", value: { type: "EVENT" } },
              { label: "React", value: { tag: "React" } },
              { label: "UI/UX", value: { tag: "UIUX" } },
              { label: "Data Science", value: { tag: "DataScience" } },
              { label: "Startup", value: { tag: "Startup" } },
              { label: "Marketing", value: { tag: "Marketing" } },
              { label: "SDG 8", value: { sdg: "SDG8" } },
              { label: "SDG 9", value: { sdg: "SDG9" } },
            ].map((f) => {
              const isActive = JSON.stringify(filter) === JSON.stringify(f.value);
              return (
                <button
                  key={f.label}
                  onClick={() => setFilter(f.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 12px",
                    background: "transparent",
                    color: isActive ? "#0047FF" : "#444",
                    border: "none",
                    fontWeight: isActive ? 900 : 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderRadius: "6px",
                    transition: "all 0.1s",
                    ...(isActive ? { background: "#E6F0FF" } : {})
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F5F0E8"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ color: "#999", fontWeight: 800 }}>#</span> {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
