
"use client";

import { useState, useEffect } from "react";
import { ExternalPlatform, LinkVisibility } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useAlert } from "@/lib/alert";

export function ExternalLinksManager() {
  const { update } = useSession();
  const alert = useAlert();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/settings/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    
    setAdding(true);
    setError("");
    
    try {
      const res = await fetch("/api/settings/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, label: newLabel }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setNewUrl("");
        setNewLabel("");
        if (data.trustScore !== undefined) {
          await update({ trustScore: data.trustScore, trustLevel: data.trustLevel });
        }
        await fetchLinks();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan link");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateVisibility = async (id: string, visibility: LinkVisibility) => {
    try {
      const res = await fetch(`/api/settings/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      if (res.ok) await fetchLinks();
    } catch (err) {}
  };

  const handleDelete = async (id: string) => {
    const confirmed = await alert.danger({
      title: "Hapus Link?",
      description: "Tautan ini akan dihapus permanen dari profil kamu. Kamu bisa menambahkannya kembali nanti.",
      confirmLabel: "Ya, Hapus",
      cancelLabel: "Batal"
    });

    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/settings/links/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.trustScore !== undefined) {
          await update({ trustScore: data.trustScore, trustLevel: data.trustLevel });
        }
        await fetchLinks();
      }
    } catch (err) {}
  };

  const totalPoints = links.reduce((acc, l) => {
    if (l.status !== "VERIFIED") return acc;
    const points: Record<string, number> = {
      LINKEDIN: 4, GITHUB: 4, PORTFOLIO: 4, BEHANCE: 4, DRIBBBLE: 4, INSTAGRAM: 4, YOUTUBE: 4, CUSTOM: 4
    };
    return acc + (points[l.platform] || 0);
  }, 0);

  const finalPoints = totalPoints;

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      <h3 style={{ fontWeight: 900, fontSize: "18px", marginBottom: "8px" }}>EXTERNAL PROFILES & LINKS</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
        Hubungkan akun eksternal untuk membangun kredibilitas dan menaikkan Trust Score.
      </p>

      {error && (
        <div style={{ background: "#FF4D4D", color: "#fff", padding: "10px", borderRadius: "4px", border: "2px solid #000", marginBottom: "16px", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 800 }}>URL Profil / Website</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "2px solid #000", 
                borderRadius: "8px", 
                background: "#F5F0E8",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: 600
              }}
              disabled={adding}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 800 }}>Nama Link (Opsional)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Contoh: My Portfolio"
              style={{ 
                width: "100%",
                padding: "12px", 
                border: "2px solid #000", 
                borderRadius: "8px", 
                background: "#fff",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: 600
              }}
              disabled={adding}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={adding || !newUrl}
          style={{
            background: "#FFE500",
            border: "3px solid #000",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "4px 4px 0px #000",
            fontSize: "14px",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(1px, 1px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"; }}
        >
          {adding ? "Sedang Menambahkan..." : "+ Tambah Link Baru"}
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Memuat...</div>
        ) : links.length === 0 ? (
          <div style={{ border: "2px dashed #ccc", padding: "30px", textAlign: "center", color: "#999", borderRadius: "8px" }}>
            Belum ada link profil eksternal.
          </div>
        ) : (
          links.map((link) => (
            <div key={link.id} style={{ 
              background: "#FFFFFF", 
              border: "2px solid #000", 
              padding: "16px", 
              borderRadius: "8px", 
              display: "flex", 
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800 }}>
                  <span style={{ fontSize: "18px" }}>
                    {link.platform === "LINKEDIN" ? "🔵" : link.platform === "GITHUB" ? "⚫" : "🔗"}
                  </span>
                  <span style={{ textTransform: "uppercase", fontSize: "14px" }}>{link.platform}</span>
                  {link.label && (
                    <span style={{ background: "#FFE500", padding: "2px 8px", borderRadius: "4px", border: "1.5px solid #000", fontSize: "12px" }}>
                      {link.label}
                    </span>
                  )}
                  {link.status === "VERIFIED" ? (
                    <span style={{ color: "#00D37F", fontSize: "12px" }}>✅ Verified</span>
                  ) : (
                    <span style={{ color: "#FF4D4D", fontSize: "12px" }}>⚠️ Unverified</span>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(link.id)}
                  style={{ background: "none", border: "none", color: "#FF4D4D", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
                >
                  Hapus
                </button>
              </div>

              <div style={{ fontSize: "13px", color: "#666", wordBreak: "break-all", fontWeight: 500 }}>{link.url}</div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 800 }}>Visibility:</label>
                <select 
                  value={link.visibility}
                  onChange={(e) => handleUpdateVisibility(link.id, e.target.value as LinkVisibility)}
                  style={{ 
                    padding: "4px 8px", 
                    border: "2px solid #000", 
                    borderRadius: "4px", 
                    background: "#fff", 
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                >
                  <option value="PUBLIC">Public</option>
                  <option value="MEMBERS_ONLY">Members Only</option>
                  <option value="COLLABORATORS_ONLY">Collaborators Only</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {links.length > 0 && (
        <div style={{ 
          marginTop: "32px", 
          padding: "16px", 
          background: "#E8F0FE", 
          border: "2px solid #000", 
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "24px" }}>💡</span>
          <div style={{ fontSize: "14px", lineHeight: 1.5 }}>
            Link yang terverifikasi berkontribusi ke Trust Score kamu.
            <br />
            Saat ini kamu mendapat <strong>+{finalPoints} poin</strong> dari external links.
          </div>
        </div>
      )}
    </div>
  );
}
