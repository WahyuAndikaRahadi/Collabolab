"use client";

import { useState, useEffect } from "react";

interface CommentProps {
  postId: string;
  currentUserId?: string;
}

export function FeedCommentSection({ postId, currentUserId }: CommentProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetch(`/api/feed/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || sending) return;

    setSending(true);
    try {
      // Basic mention detection
      const mentions = newComment.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];

      const res = await fetch(`/api/feed/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, mentions, parentId: replyTo?.id || null }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        setNewComment("");
        setReplyTo(null);
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  const buildCommentTree = (flatComments: any[]) => {
    const map = new Map();
    const roots: any[] = [];
    flatComments.forEach(c => map.set(c.id, { ...c, children: [] }));
    flatComments.forEach(c => {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) parent.children.push(map.get(c.id));
      } else {
        roots.push(map.get(c.id));
      }
    });
    return roots;
  };

  const commentTree = buildCommentTree(comments);

  const renderComment = (c: any, isReply = false) => (
    <div key={c.id} style={{ display: "flex", gap: "10px", marginTop: isReply ? "8px" : "0" }}>
      <div style={{ width: isReply ? "24px" : "32px", height: isReply ? "24px" : "32px", borderRadius: "50%", border: "2px solid #000", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: isReply ? "10px" : "12px", flexShrink: 0 }}>
        {c.author.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ background: "#F5F0E8", border: "2px solid #000", padding: "8px 12px", borderRadius: "0 8px 8px 8px", fontSize: "13px", position: "relative" }}>
          <div style={{ fontWeight: 800, fontSize: "11px", marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
            <span>{c.author.name}</span>
            {currentUserId && (
              <button onClick={() => setReplyTo({ id: c.id, name: c.author.name })} style={{ background: "none", border: "none", color: "#0047FF", fontSize: "10px", fontWeight: 800, cursor: "pointer", padding: 0 }}>Reply</button>
            )}
          </div>
          <div style={{ lineHeight: 1.4 }}>{c.content}</div>
        </div>
        {c.children && c.children.length > 0 && (
          <div style={{ paddingLeft: "16px", borderLeft: "2px dashed #ccc", marginLeft: "12px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {c.children.map((child: any) => renderComment(child, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "16px", borderTop: "2px solid #000", background: "#FFFFFF" }}>
      {loading ? (
        <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>Memuat komentar...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          {commentTree.map((c) => renderComment(c))}
        </div>
      )}

      {currentUserId && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {replyTo && (
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#666", display: "flex", justifyContent: "space-between" }}>
              <span>Replying to {replyTo.name}</span>
              <button onClick={() => setReplyTo(null)} style={{ background: "none", border: "none", color: "#FF4D4D", cursor: "pointer", fontWeight: 800 }}>Batal</button>
            </div>
          )}
          <form onSubmit={handlePostComment} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Tulis balasan..." : "Tulis komentar... (@mention)"}
              maxLength={200}
              style={{
                flex: 1,
                background: "#F5F0E8",
                border: "2px solid #000",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending || !newComment.trim()}
              style={{
                background: "#FFE500",
                border: "2px solid #000",
                borderRadius: "4px",
                padding: "0 20px",
                fontWeight: 900,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              {sending ? "..." : "Kirim"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
