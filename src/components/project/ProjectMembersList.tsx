"use client";

import { useState } from "react";
import { MemberRoleModal } from "./MemberRoleModal";
import { getTrustLevelEmoji, getTrustLevelLabel } from "@/lib/trust-score";

type Member = {
  id: string;
  userId: string;
  isAnonymous: boolean;
  anonymousTag: string | null;
  revealedAt: Date | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  roleTitle: string | null;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
    trustScore: number;
    trustLevel: string;
  };
};

interface Props {
  initialMembers: Member[];
  projectId: string;
  currentUserId?: string;
  isOwner: boolean;
  isAdmin: boolean;
}

export function ProjectMembersList({ initialMembers, projectId, currentUserId, isOwner, isAdmin }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);


  function handleUpdateMember(updated: any) {
    setMembers((prev) => prev.map((m) => m.id === updated.id ? { ...m, ...updated } : m));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {members.map((m) => {
        const isAnon = m.isAnonymous && !m.revealedAt;
        const displayName = isAnon ? `Anon#${m.anonymousTag || "0000"}` : m.user.name;
        const canEdit = (isOwner || isAdmin) && m.role !== "OWNER" && m.userId !== currentUserId;
        
        return (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#F5F0E8", border: "1.5px solid #000", borderRadius: "6px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #000", background: m.role === "OWNER" ? "#FFE500" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "16px", overflow: "hidden" }}>
              {isAnon ? "👤" : m.user.image ? <img src={m.user.image} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : displayName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                {displayName}
                {m.userId === currentUserId && <span style={{fontSize:'11px', background:'#0047FF', color:'#fff', padding:'1px 4px', borderRadius:'3px', marginLeft:'6px'}}>Kamu</span>}
              </div>
              <div style={{ fontSize: "12px", color: "#3D3D3D", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: 800 }}>
                  {m.role === "OWNER" ? "👑 Owner" : m.role === "ADMIN" ? "🛡️ Admin" : "Member"}
                </span>
                {m.roleTitle && (
                  <>
                    <span>•</span>
                    <span style={{ fontStyle: "italic", fontWeight: 600, color: "#0047FF" }}>{m.roleTitle}</span>
                  </>
                )}
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {!isAnon && (
                  <div 
                    title={`${getTrustLevelLabel(m.user.trustLevel as any)}: ${m.user.trustScore} pts`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#fff",
                      border: "1.5px solid #000",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      boxShadow: "1.5px 1.5px 0px #000",
                      cursor: "help"
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{getTrustLevelEmoji(m.user.trustLevel as any)}</span>
                    <span style={{ 
                      fontFamily: "Space Grotesk, sans-serif", 
                      fontWeight: 800, 
                      fontSize: "11px",
                      color: "#000"
                    }}>
                      {m.user.trustScore}
                    </span>
                  </div>
                )}
                
                {canEdit && (
                    <button 
                        onClick={() => setSelectedMember(m)}
                        className="btn-secondary btn-sm"
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                    >
                        ⚙️ Atur
                    </button>
                )}
            </div>
          </div>
        );
      })}

      {selectedMember && (
        <MemberRoleModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember as any}
          projectId={projectId}
          onUpdate={handleUpdateMember}
          currentUserRole={isOwner ? "OWNER" : "ADMIN"}
        />
      )}
    </div>
  );
}
