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

  if (loading) return <div>Memuat data report...</div>;

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {reports.map((r) => (
        <div key={r.id} style={{ 
          background: "#fff", 
          border: "3px solid #000", 
          borderRadius: "12px", 
          padding: "24px", 
          boxShadow: "6px 6px 0px #000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "#000", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 800 }}>
                {r.targetType}
              </span>
              <span style={{ background: r.status === "PENDING" ? "#FFE500" : "#00D37F", border: "1.5px solid #000", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 800 }}>
                {r.status}
              </span>
            </div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>
              {r.reason}
            </h3>
            <p style={{ color: "#3D3D3D", fontSize: "14px", margin: "0 0 12px" }}>
              {r.description || "No detailed description provided."}
            </p>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#666" }}>
              Reported by {r.reporter.name} • {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {r.status === "PENDING" && (
              <>
                <button 
                  onClick={() => updateStatus(r.id, "RESOLVED")}
                  style={{ background: "#00D37F", border: "2px solid #000", padding: "8px 16px", borderRadius: "6px", fontWeight: 800, cursor: "pointer", boxShadow: "2px 2px 0px #000" }}
                >
                  Resolve
                </button>
                <button 
                  onClick={() => updateStatus(r.id, "DISMISSED")}
                  style={{ background: "#F5F0E8", border: "2px solid #000", padding: "8px 16px", borderRadius: "6px", fontWeight: 800, cursor: "pointer", boxShadow: "2px 2px 0px #000" }}
                >
                  Dismiss
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {reports.length === 0 && <p>Belum ada laporan yang masuk.</p>}
    </div>
  );
}
