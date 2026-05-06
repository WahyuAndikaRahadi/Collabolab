"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  roomId: string;
  roomName: string;
  onSuccess: () => void;
  onClose: () => void;
};

export function PasswordModal({ projectId, roomId, roomName, onSuccess, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/hub/${projectId}/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password salah.");
      onSuccess();
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
        background: "rgba(0,0,0,0.88)",
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
        maxWidth: "380px",
        margin: "0 16px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔒</div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px", marginBottom: "8px", marginTop: 0 }}>
          Room Private
        </h2>
        <p style={{ color: "#3D3D3D", fontSize: "14px", marginBottom: "24px" }}>
          <strong>#{roomName}</strong> dilindungi password. Masukkan password untuk masuk.
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            id="room-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password..."
            required
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "12px 16px",
              fontSize: "16px",
              outline: "none",
              textAlign: "center",
              letterSpacing: "4px",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              id="room-password-submit"
              disabled={loading || !password}
              style={{
                flex: 1,
                background: "#000",
                border: "2px solid #000",
                borderRadius: "6px",
                padding: "12px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                cursor: loading || !password ? "not-allowed" : "pointer",
                color: "#FFE500",
                opacity: loading || !password ? 0.5 : 1,
              }}
            >
              {loading ? "Verifikasi..." : "Masuk"}
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
