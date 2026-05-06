"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  onCreated: (room: { id: string; name: string; description: string | null; type: "CUSTOM"; isPrivate: boolean; createdAt: string }) => void;
  onClose: () => void;
};

export function CreateRoomModal({ projectId, onCreated, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preview = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!preview) return setError("Nama room tidak valid.");

    setLoading(true);
    try {
      const res = await fetch(`/api/hub/${projectId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: preview,
          description: description || undefined,
          password: usePassword && password ? password : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat room.");
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff",
        border: "3px solid #000",
        borderRadius: "12px",
        boxShadow: "8px 8px 0px #000",
        padding: "32px",
        width: "100%",
        maxWidth: "460px",
        margin: "0 16px",
      }}>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "22px", marginBottom: "8px", marginTop: 0 }}>
          🏠 Buat Room Baru
        </h2>
        <p style={{ color: "#3D3D3D", fontSize: "14px", marginBottom: "24px" }}>
          Room custom dapat memiliki chat dan kanban board tersendiri.
        </p>

        {error && (
          <div style={{
            background: "#FFF0F0", border: "2px solid #FF4D4D",
            borderRadius: "6px", padding: "10px 14px",
            marginBottom: "16px", color: "#FF4D4D", fontWeight: 600, fontSize: "13px",
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name */}
          <div>
            <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Nama Room *
            </label>
            <input
              id="create-room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: frontend, design-ui"
              maxLength={32}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            {preview && (
              <div style={{ marginTop: "6px", fontSize: "12px", color: "#3D3D3D" }}>
                Preview: <span style={{
                  fontFamily: "JetBrains Mono, monospace",
                  background: "#F5F0E8",
                  border: "1px solid #000",
                  borderRadius: "3px",
                  padding: "1px 6px",
                  fontWeight: 700,
                }}>#{preview}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Deskripsi (opsional)
            </label>
            <input
              id="create-room-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Diskusi khusus tim frontend"
              maxLength={200}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </div>

          {/* Password toggle */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px" }}>
              <input
                id="create-room-use-password"
                type="checkbox"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#000", cursor: "pointer" }}
              />
              🔒 Tambah Password (Private Room)
            </label>
            {usePassword && (
              <input
                id="create-room-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password room (min. 4 karakter)"
                minLength={4}
                required={usePassword}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "2px solid #000",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  marginTop: "10px",
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="submit"
              id="create-room-submit"
              disabled={loading}
              style={{
                flex: 1,
                background: "#FFE500",
                border: "2px solid #000",
                borderRadius: "6px",
                boxShadow: "3px 3px 0px #000",
                padding: "12px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#000",
                transition: "all 0.15s ease",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Membuat..." : "Buat Room"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#fff",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "12px 20px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
