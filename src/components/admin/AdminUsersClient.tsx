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
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        toast.error("Error", data.error || "Gagal mengambil data user");
        setUsers([]);
      }
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

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#000", fontFamily: "JetBrains Mono, monospace", fontWeight: 800 }}>
      {">"} INITIALIZING_USER_DATABASE...
    </div>
  );

  return (
    <div style={{ 
      background: "#FFFFFF", 
      border: "3px solid #000", 
      borderRadius: "12px", 
      boxShadow: "10px 10px 0px #000", 
      overflow: "hidden",
      color: "#000" 
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#000", borderBottom: "3px solid #000", color: "#FFE500", fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>
              <th style={{ padding: "20px" }}>Identification</th>
              <th style={{ padding: "20px" }}>Trust Parameters</th>
              <th style={{ padding: "20px" }}>System Status</th>
              <th style={{ padding: "20px" }}>Access Level</th>
              <th style={{ padding: "20px" }}>Directives</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "2px solid #f0f0f0", transition: "background 0.1s ease" }}>
                <td style={{ padding: "20px" }}>
                  <div style={{ fontWeight: 800, color: "#000", fontSize: "16px" }}>{user.name}</div>
                  <div style={{ fontSize: "12px", color: "#666", fontFamily: "JetBrains Mono, monospace" }}>{user.email}</div>
                </td>
                <td style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <input 
                        type="number" 
                        defaultValue={user.trustScore}
                        onBlur={(e) => updateTrustScore(user.id, e.target.value)}
                        style={{ 
                          width: "70px", 
                          padding: "6px 10px", 
                          background: "#fff",
                          color: "#000",
                          border: "2px solid #000", 
                          borderRadius: "4px", 
                          fontFamily: "JetBrains Mono, monospace",
                          fontWeight: 800,
                          outline: "none",
                          boxShadow: "2px 2px 0px #000"
                        }}
                      />
                    </div>
                    <span style={{ 
                      fontSize: "11px", 
                      fontWeight: 800, 
                      color: "#000",
                      background: "#f0f0f0",
                      padding: "2px 8px",
                      borderRadius: "2px",
                      border: "1px solid #000"
                    }}>
                      {user.trustLevel}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "20px" }}>
                  <span style={{ 
                    padding: "4px 12px", 
                    borderRadius: "2px", 
                    border: "2px solid #000",
                    background: user.isBlocked ? "#FF4D4D" : "#00D37F",
                    color: user.isBlocked ? "#fff" : "#000",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "0.5px",
                    boxShadow: "2px 2px 0px #000"
                  }}>
                    {user.isBlocked ? "BLOCKED" : "OPERATIONAL"}
                  </span>
                </td>
                <td style={{ padding: "20px" }}>
                   <div style={{ 
                     display: "inline-block",
                     padding: "4px 10px",
                     background: user.role === "ADMIN" ? "#FFE500" : "#fff",
                     color: "#000",
                     borderRadius: "2px",
                     border: "2px solid #000",
                     fontSize: "11px",
                     fontWeight: 900,
                     boxShadow: "2px 2px 0px #000"
                   }}>
                     {user.role}
                   </div>
                </td>
                <td style={{ padding: "20px" }}>
                  <button
                    onClick={() => updateStatus(user.id, !user.isBlocked)}
                    style={{
                      padding: "8px 16px",
                      background: user.isBlocked ? "#00D37F" : "#FF4D4D",
                      color: user.isBlocked ? "#000" : "#fff",
                      border: "2px solid #000",
                      borderRadius: "4px",
                      fontWeight: 900,
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                      textTransform: "uppercase",
                      boxShadow: "4px 4px 0px #000"
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as any).style.transform = "translate(2px, 2px)";
                      (e.currentTarget as any).style.boxShadow = "2px 2px 0px #000";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as any).style.transform = "none";
                      (e.currentTarget as any).style.boxShadow = "4px 4px 0px #000";
                    }}
                  >
                    {user.isBlocked ? "Activate" : "Terminate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
