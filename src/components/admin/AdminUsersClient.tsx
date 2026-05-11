'use client'

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/toast';

type User = {
  id: string;
  name: string;
  email: string | null;
  trustScore: number;
  trustLevel: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
};

export function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Error", "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(userId: string, isBlocked: boolean) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBlocked })
      });
      if (res.ok) {
        toast.success("Success", `User berhasil di ${isBlocked ? 'blokir' : 'aktifkan'}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error("Error", "Gagal update status user");
    }
  }

  async function updateTrustScore(userId: string, score: string) {
    if (isNaN(parseInt(score))) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trustScore: score })
      });
      if (res.ok) {
        toast.success("Success", "Trust score diperbarui");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Error", "Gagal update trust score");
    }
  }

  if (loading) return <div>Memuat data user...</div>;

  return (
    <div style={{ background: "#fff", border: "4px solid #000", borderRadius: "12px", boxShadow: "8px 8px 0px #000", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#000", color: "#fff", fontFamily: "Space Grotesk, sans-serif", fontWeight: 800 }}>
            <th style={{ padding: "16px" }}>User</th>
            <th style={{ padding: "16px" }}>Trust Score</th>
            <th style={{ padding: "16px" }}>Status</th>
            <th style={{ padding: "16px" }}>Role</th>
            <th style={{ padding: "16px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: "2px solid #000", transition: "background 0.15s ease" }}>
              <td style={{ padding: "16px" }}>
                <div style={{ fontWeight: 800 }}>{user.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
              </td>
              <td style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input 
                    type="number" 
                    defaultValue={user.trustScore}
                    onBlur={(e) => updateTrustScore(user.id, e.target.value)}
                    style={{ 
                      width: "60px", 
                      padding: "4px 8px", 
                      border: "2px solid #000", 
                      borderRadius: "4px", 
                      fontFamily: "JetBrains Mono, monospace",
                      fontWeight: 700 
                    }}
                  />
                  <span style={{ fontSize: "12px", fontWeight: 700 }}>({user.trustLevel})</span>
                </div>
              </td>
              <td style={{ padding: "16px" }}>
                <span style={{ 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  border: "2px solid #000",
                  background: user.isBlocked ? "#FF4D4D" : "#00D37F",
                  color: user.isBlocked ? "#fff" : "#000",
                  fontSize: "12px",
                  fontWeight: 800
                }}>
                  {user.isBlocked ? "BLOCKED" : "ACTIVE"}
                </span>
              </td>
              <td style={{ padding: "16px", fontWeight: 700 }}>{user.role}</td>
              <td style={{ padding: "16px" }}>
                <button
                  onClick={() => updateStatus(user.id, !user.isBlocked)}
                  style={{
                    padding: "8px 16px",
                    background: user.isBlocked ? "#00D37F" : "#FF4D4D",
                    color: user.isBlocked ? "#000" : "#fff",
                    border: "2px solid #000",
                    borderRadius: "4px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "2px 2px 0px #000"
                  }}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
