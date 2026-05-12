'use client'

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/toast';

type Report = {
  id: string;
  targetId: string;
  targetType: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reporter: { name: string };
};

export function AdminReportsClient() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      toast.error("Error", "Gagal mengambil data report");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(reportId: string, status: string) {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status })
      });
      if (res.ok) {
        toast.success("Success", `Report status updated to ${status}`);
        fetchReports();
      }
    } catch (err) {
      toast.error("Error", "Gagal update report");
    }
  }

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#000", fontFamily: "JetBrains Mono, monospace", fontWeight: 800 }}>
      {">"} INITIALIZING_SECURITY_LOGS...
    </div>
  );

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {Array.isArray(reports) && reports.map((r) => (
        <div key={r.id} style={{ 
          background: "#FFFFFF", 
          border: "3px solid #000", 
          borderRadius: "12px", 
          padding: "32px", 
          boxShadow: "8px 8px 0px #000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Accent decoration */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", background: r.status === "PENDING" ? "#FFE500" : "#00D37F" }} />
          
          <div style={{ paddingLeft: "12px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <span style={{ background: "#000", color: "#FFE500", border: "2px solid #000", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase" }}>
                {r.targetType}
              </span>
              <span style={{ 
                background: r.status === "PENDING" ? "#FFE500" : "#00D37F", 
                border: "2px solid #000", 
                padding: "4px 10px", 
                borderRadius: "4px", 
                fontSize: "11px", 
                fontWeight: 900,
                boxShadow: "2px 2px 0px #000"
              }}>
                {r.status}
              </span>
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "22px", margin: "0 0 8px", color: "#000" }}>
              {r.reason}
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "16px", margin: "0 0 20px", fontWeight: 500, lineHeight: 1.6 }}>
              {r.description || "No detailed description provided by the reporter."}
            </p>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#666", fontFamily: "JetBrains Mono, monospace", background: "#f0f0f0", padding: "6px 12px", borderRadius: "4px", display: "inline-block" }}>
               ORIGIN: {r.reporter.name.toUpperCase()} • {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {r.status === "PENDING" ? (
              <>
                <button 
                  onClick={() => updateStatus(r.id, "RESOLVED")}
                  style={{ 
                    background: "#00D37F", 
                    border: "2px solid #000", 
                    padding: "10px 20px", 
                    borderRadius: "6px", 
                    fontWeight: 900, 
                    cursor: "pointer", 
                    boxShadow: "4px 4px 0px #000",
                    transition: "all 0.1s ease"
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px, 2px)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
                >
                  {r.targetType === "FEED_POST" ? "RESOLVE (Hapus Post)" : "RESOLVE"}
                </button>
                <button 
                  onClick={() => updateStatus(r.id, "DISMISSED")}
                  style={{ 
                    background: "#FFFFFF", 
                    border: "2px solid #000", 
                    padding: "10px 20px", 
                    borderRadius: "6px", 
                    fontWeight: 900, 
                    cursor: "pointer", 
                    boxShadow: "4px 4px 0px #000",
                    transition: "all 0.1s ease"
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px, 2px)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
                >
                  DISMISS
                </button>
              </>
            ) : (
              <div style={{ color: "#00D37F", fontWeight: 900, fontSize: "12px", padding: "8px", border: "2px solid #00D37F", borderRadius: "4px" }}>
                 RESOLVED ✓
              </div>
            )}
          </div>
        </div>
      ))}
      {(!Array.isArray(reports) || reports.length === 0) && !loading && (
        <div style={{ padding: "60px", textAlign: "center", background: "#fff", border: "3px dashed #ccc", borderRadius: "12px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🛡️</div>
          <p style={{ fontWeight: 800, color: "#666" }}>No security reports pending. The ecosystem is stable.</p>
        </div>
      )}
    </div>
  );
}
