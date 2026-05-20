"use client";

import { useState, useEffect, useRef } from "react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher";
import { MentionInput } from "./MentionInput";
import { User } from "lucide-react";

type Member = {
  id: string;
  userId: string;
  isAnonymous: boolean;
  anonymousTag: string | null;
  revealedAt: string | null;
  role: string;
  roleTitle: string | null;
  user: { id: string; name: string; username: string; image: string | null };
};

type HubMessage = {
  id: string;
  content: string;
  createdAt: string;
  mentions: string[];
  type?: "TEXT" | "POLL";
  poll?: any;
  sender: { id: string; name: string; image: string | null; isAnonymous?: boolean };
  status?: "pending" | "sent";
};

type OnlineStatus = { [userId: string]: "online" | "away" | "offline" };

type Props = {
  projectId: string;
  roomId: string;
  roomName: string;
  roomType: "ANNOUNCEMENT" | "GENERAL" | "KANBAN" | "CUSTOM";
  roomDescription: string | null;
  members: Member[];
  onlineStatus: OnlineStatus;
  currentUserId: string;
  currentMember: Member;
  activeTab?: "chat" | "kanban";
};

export function HubChat({ projectId, roomId, roomName, roomType, roomDescription, members, onlineStatus, currentUserId, currentMember, activeTab = "chat" }: Props) {
  const [messages, setMessages] = useState<HubMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isOwner = currentMember.role === "OWNER";
  const isAnnouncement = roomType === "ANNOUNCEMENT";
  const canSend = !isAnnouncement || isOwner;

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetch(`/api/hub/${projectId}/rooms/${roomId}/messages`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMessages(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, roomId]);

  useEffect(() => {
    let pusher: ReturnType<typeof getPusherClient>;
    try {
      pusher = getPusherClient();
      const channel = pusher.subscribe(CHANNELS.hubRoom(roomId));
      channel.bind(EVENTS.HUB_MESSAGE, (msg: HubMessage) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, { ...msg, status: "sent" }];
        });
      });
      channel.bind("hub-poll-vote", (data: { messageId: string; poll: any }) => {
        setMessages((prev) => prev.map(m => m.id === data.messageId ? { ...m, poll: data.poll } : m));
      });

      const projectChannel = pusher.subscribe(CHANNELS.project(projectId));
      projectChannel.bind(EVENTS.IDENTITY_REVEALED, ({ memberId, userName, anonymousTag }: { memberId: string; userName: string; anonymousTag: string }) => {
        setMessages((prev) => prev.map((m) => {
          if (m.sender.id === memberId || (m.sender.isAnonymous && memberId === currentUserId && currentMember.isAnonymous)) {
            return { ...m, sender: { ...m.sender, name: userName, isAnonymous: false } };
          }
          return m;
        }));
      });

    } catch {}
    return () => {
      try { 
        pusher?.unsubscribe(CHANNELS.hubRoom(roomId)); 
        pusher?.unsubscribe(CHANNELS.project(projectId));
      } catch {}
    };
  }, [roomId, projectId, currentUserId, currentMember.isAnonymous]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(content: string, mentions: string[]) {
    const pendingId = `pending-${Date.now()}`;
    const pendingMsg: HubMessage = {
      id: pendingId,
      content,
      createdAt: new Date().toISOString(),
      mentions,
      status: "pending",
      sender: {
        id: currentUserId,
        name: currentMember.isAnonymous && !currentMember.revealedAt ? `Anon#${currentMember.anonymousTag || "0000"}` : currentMember.user.name,
        image: currentMember.isAnonymous && !currentMember.revealedAt ? null : currentMember.user.image,
        isAnonymous: currentMember.isAnonymous && !currentMember.revealedAt
      }
    };

    setMessages((prev) => [...prev, pendingMsg]);

    try {
      const res = await fetch(`/api/hub/${projectId}/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mentions }),
      });
      
      if (res.ok) {
        const savedMsg = await res.json();
        savedMsg.status = "sent";
        
        setMessages((prev) => {
          if (prev.find(m => m.id === savedMsg.id)) {
            return prev.filter(m => m.id !== pendingId).map(m => m.id === savedMsg.id ? { ...m, status: "sent" } : m);
          }
          return prev.map((m) => (m.id === pendingId ? savedMsg : m));
        });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
    }
  }

  async function handleSendPoll(question: string, options: string[]) {
    const pendingId = `pending-poll-${Date.now()}`;
    const pendingMsg: HubMessage = {
      id: pendingId,
      content: "",
      createdAt: new Date().toISOString(),
      mentions: [],
      status: "pending",
      type: "POLL",
      poll: {
        question,
        options: options.map((opt, idx) => ({
          id: `temp-opt-${idx}`,
          text: opt,
          votes: []
        }))
      },
      sender: {
        id: currentUserId,
        name: currentMember.isAnonymous && !currentMember.revealedAt ? `Anon#${currentMember.anonymousTag || "0000"}` : currentMember.user.name,
        image: currentMember.isAnonymous && !currentMember.revealedAt ? null : currentMember.user.image,
        isAnonymous: currentMember.isAnonymous && !currentMember.revealedAt
      }
    };

    setMessages((prev) => [...prev, pendingMsg]);

    try {
      const res = await fetch(`/api/hub/${projectId}/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "", mentions: [], type: "POLL", pollQuestion: question, pollOptions: options }),
      });
      
      if (res.ok) {
        const savedMsg = await res.json();
        savedMsg.status = "sent";
        
        setMessages((prev) => {
          if (prev.find(m => m.id === savedMsg.id)) {
            return prev.filter(m => m.id !== pendingId).map(m => m.id === savedMsg.id ? { ...m, status: "sent" } : m);
          }
          return prev.map((m) => (m.id === pendingId ? savedMsg : m));
        });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
    }
  }

  async function handleVote(messageId: string, optionId: string) {
    try {
      await fetch(`/api/hub/${projectId}/rooms/${roomId}/messages/${messageId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId })
      });
    } catch (e) {}
  }

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Hari Ini";
    if (d.toDateString() === yesterday.toDateString()) return "Kemarin";
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
  };

  const grouped: { date: string; messages: HubMessage[] }[] = [];
  for (const msg of messages) {
    const d = formatDate(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last && last.date === d) last.messages.push(msg);
    else grouped.push({ date: d, messages: [msg] });
  }

  function renderContent(content: string, myMessage: boolean) {
    const possibleNames = members.map((m) => {
      if (m.isAnonymous && !m.revealedAt) return `Anon#${m.anonymousTag || "0000"}`;
      return m.user.name;
    });
    possibleNames.push("all");

    const sortedNames = [...possibleNames].sort((a, b) => b.length - a.length);
    
    const escapedNames = sortedNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    const mentionRegex = new RegExp(`(@(?:${escapedNames.join("|")}))`, "g");

    const parts = content.split(mentionRegex);
    return parts.map((part, i) => {
      const isMention = part.startsWith("@") && possibleNames.some(n => `@${n}` === part);
      
      if (isMention) {
        return (
          <span key={i} style={{ color: "#0047FF", fontWeight: 900 }}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", overflow: "hidden" }}>
      {/* Room header */}
      <div style={{
        padding: "12px 20px",
        borderBottom: "3px solid #000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        background: "#FFFFFF",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
          <div style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 900,
            fontSize: "18px",
            color: "#000000",
          }}>
            {roomType === "GENERAL" ? "💬" : roomType === "ANNOUNCEMENT" ? "📢" : "#"} {roomName}
          </div>
          {roomDescription && (
            <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{roomDescription}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {currentMember.isAnonymous && !currentMember.revealedAt && (
            <button
              onClick={async () => {
                const res = await fetch(`/api/projects/${projectId}/members/${currentMember.id}/reveal`, { method: "POST" });
                if (res.ok) {
                  // Memicu event Pusher secara otomatis dari API
                }
              }}
              style={{
                background: "#FFE500",
                border: "2px solid #000000",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "2px 2px 0px #000",
                fontFamily: "Space Grotesk, sans-serif"
              }}
              title="Semua orang akan tahu nama aslimu!"
            >
              🕵️ Reveal Identity
            </button>
          )}

          {isAnnouncement && !isOwner && (
            <div style={{
              background: "#F5F0E8",
              border: "2px solid #000000",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "#000000",
              fontWeight: 800,
              fontFamily: "Space Grotesk, sans-serif",
              boxShadow: "2px 2px 0px #000",
            }}>
              📢 Read-only
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#3D3D3D", padding: "40px", fontSize: "14px", fontWeight: 600 }}>Memuat pesan...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#3D3D3D", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {roomType === "ANNOUNCEMENT" ? "📢" : "💬"}
            </div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: "#000000", marginBottom: "6px" }}>
              Belum ada pesan di #{roomName}
            </div>
            <div style={{ fontSize: "14px", color: "#3D3D3D" }}>
              {isAnnouncement && !isOwner ? "Owner akan memposting pengumuman di sini." : "Jadilah yang pertama mengirim pesan!"}
            </div>
          </div>
        ) : (
          grouped.map(({ date, messages: dayMsgs }) => (
            <div key={date}>
              {/* Date separator */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 12px" }}>
                <div style={{ flex: 1, height: "2px", background: "#000000" }} />
                <div style={{ color: "#000000", fontSize: "12px", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.5px", background: "#FFE500", border: "2px solid #000", padding: "2px 10px", borderRadius: "20px", boxShadow: "2px 2px 0px #000" }}>{date}</div>
                <div style={{ flex: 1, height: "2px", background: "#000000" }} />
              </div>

              {dayMsgs.map((msg, i) => {
                const isMe = msg.sender.id === currentUserId;
                const prevMsg = i > 0 ? dayMsgs[i - 1] : null;
                const sameAuthor = prevMsg && prevMsg.sender.id === msg.sender.id;

                return (
                  <div key={msg.id} id={`hub-msg-${msg.id}`} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: "10px", marginBottom: sameAuthor ? "2px" : "12px", alignItems: "flex-end" }}>
                    {/* Avatar */}
                    {!sameAuthor && (
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: isMe ? "#FFE500" : "#F5F0E8", border: "2px solid #000000",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden", flexShrink: 0,
                      }}>
                        {msg.sender.isAnonymous ? (
                          <User size={18} />
                        ) : msg.sender.image ? (
                          <img src={msg.sender.image} alt={msg.sender.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <User size={18} strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                    {sameAuthor && <div style={{ width: "32px", flexShrink: 0 }} />}

                    <div style={{ maxWidth: "65%" }}>
                      {!sameAuthor && !isMe && (
                        <div style={{ fontSize: "12px", color: "#3D3D3D", marginBottom: "4px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>
                          {msg.sender.name}
                        </div>
                      )}
                      <div style={{
                        background: isMe ? "#FFE500" : "#F5F0E8",
                        color: "#000000",
                        border: "2px solid #000000",
                        borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        padding: "8px 14px",
                        fontSize: "15px",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                        boxShadow: isMe ? "-2px 2px 0px #000" : "2px 2px 0px #000",
                      }}>
                        {msg.type === "POLL" && msg.poll ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
                            <div style={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", fontSize: "16px", marginBottom: "4px" }}>📊 {msg.poll.question}</div>
                            {msg.poll.options.map((opt: any) => {
                               const totalVotes = msg.poll.options.reduce((acc: number, o: any) => acc + o.votes.length, 0);
                               const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
                               const hasVoted = opt.votes.some((v: any) => v.userId === currentUserId);
                               
                               return (
                                 <div key={opt.id} style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "4px" }}>
                                   <button
                                     type="button"
                                     onClick={() => handleVote(msg.id, opt.id)}
                                     disabled={msg.status === "pending"}
                                     style={{
                                       position: "relative",
                                       display: "flex",
                                       justifyContent: "space-between",
                                       background: hasVoted ? "rgba(0,0,0,0.1)" : "#fff",
                                       border: "2px solid #000",
                                       padding: "8px 12px",
                                       borderRadius: "6px",
                                       cursor: msg.status === "pending" ? "not-allowed" : "pointer",
                                       overflow: "hidden",
                                       textAlign: "left"
                                     }}
                                   >
                                     <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${percentage}%`, background: hasVoted ? "#00D37F" : "rgba(0,0,0,0.1)", zIndex: 0, transition: "width 0.3s ease" }} />
                                     <span style={{ position: "relative", zIndex: 1, fontWeight: hasVoted ? 800 : 600 }}>{opt.text}</span>
                                     <span style={{ position: "relative", zIndex: 1, fontWeight: 800, fontSize: "12px" }}>{percentage}%</span>
                                   </button>
                                   
                                   {opt.votes.length > 0 && (
                                     <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "4px" }}>
                                       <div style={{ display: "flex" }}>
                                         {opt.votes.slice(0, 5).map((v: any, idx: number) => (
                                           <div key={v.userId} title={v.user?.name} style={{
                                             width: "20px", height: "20px", borderRadius: "50%", border: "1.5px solid #000",
                                             marginLeft: idx > 0 ? "-6px" : "0", background: "#F5F0E8", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 - idx
                                           }}>
                                             {v.user?.image ? (
                                               <img src={v.user.image} alt={v.user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                             ) : (
                                               <span style={{ fontSize: "10px", fontWeight: 800 }}>{v.user?.name?.charAt(0) || "?"}</span>
                                             )}
                                           </div>
                                         ))}
                                       </div>
                                       {opt.votes.length > 5 && (
                                         <span style={{ fontSize: "10px", fontWeight: 700, color: "#555" }}>+{opt.votes.length - 5} memilih ini</span>
                                       )}
                                     </div>
                                   )}
                                 </div>
                               );
                            })}
                            <div style={{ fontSize: "11px", fontWeight: 700, marginTop: "4px", color: "#555" }}>
                              Total suara: {msg.poll.options.reduce((acc: number, o: any) => acc + o.votes.length, 0)}
                            </div>
                          </div>
                        ) : (
                          renderContent(msg.content, isMe)
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "4px", textAlign: isMe ? "right" : "left", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: isMe ? "flex-end" : "flex-start", gap: "4px" }}>
                        {formatTime(msg.createdAt)}
                        {isMe && msg.status === "pending" && <span style={{ color: "#888", fontSize: "12px", marginLeft: "2px" }} title="Mengirim...">🕒</span>}
                        {isMe && (msg.status === "sent" || !msg.status) && <span style={{ color: "#00D37F", fontWeight: 900, fontSize: "12px", marginLeft: "2px" }} title="Terkirim">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <MentionInput
        members={members}
        onlineStatus={onlineStatus}
        onSend={handleSend}
        disabled={!canSend}
        disabledReason="Hanya owner yang bisa mengirim di #announcement"
        currentUserId={currentUserId}
        canCreatePoll={isOwner || currentMember.role === "ADMIN"}
        onSendPoll={handleSendPoll}
      />
    </div>
  );
}
