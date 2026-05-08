"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

type Member = {
  id: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  roleTitle: string | null;
  user: { name: string; image: string | null };
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  projectId: string;
  onUpdate: (updatedMember: Member) => void;
  currentUserRole: string;
}

export function MemberRoleModal({ isOpen, onClose, member, projectId, onUpdate, currentUserRole }: Props) {
  const [role, setRole] = useState(member.role);
  const [roleTitle, setRoleTitle] = useState(member.roleTitle || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = currentUserRole === "OWNER";

  async function handleUpdate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, roleTitle: roleTitle.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpdate(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Atur Role: ${member.user.name}`} size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {error && <div style={{ color: "#FF4D4D", fontWeight: 700, fontSize: "14px" }}>⚠️ {error}</div>}

        <div>
          <label style={{ display: "block", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, marginBottom: "8px" }}>Tingkat Akses</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as any)}
            className="nb-textarea"
            style={{ width: "100%", padding: "10px" }}
            disabled={!isOwner && member.role === "ADMIN"} // Admin can't change other admins
          >
            <option value="MEMBER">Member (Akses terbatas)</option>
            <option value="ADMIN">Admin (Bisa atur task & member lain)</option>
            {isOwner && <option value="OWNER">Owner (Transfer kepemilikan)</option>}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, marginBottom: "8px" }}>Role Title (Opsional)</label>
          <input
            type="text"
            className="nb-textarea"
            placeholder="Contoh: Programmer Team Leader, UI Designer..."
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
          <p style={{ fontSize: "12px", color: "#3D3D3D", marginTop: "4px" }}>
            Anggota dengan Role Title memiliki akses untuk menugaskan task.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Batal</button>
          <button onClick={handleUpdate} className="btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
