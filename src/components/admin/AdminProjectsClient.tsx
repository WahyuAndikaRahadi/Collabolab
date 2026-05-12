'use client'

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/toast';
import { useAlert } from '@/lib/alert';

type Project = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  owner: { name: string; email: string | null };
  _count: { members: number };
};

export function AdminProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const alert = useAlert();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      toast.error("Error", "Gagal mengambil data project");
    } finally {
      setLoading(false);
    }
  }

  async function takeDown(id: string) {
    const isConfirmed = await alert.confirm({
      title: "Konfirmasi Take Down",
      description: "Apakah Anda yakin ingin me-take down project ini? Project akan diarsipkan.",
      confirmLabel: "Take Down"
    });
    
    if (!isConfirmed) return;
    
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Success", "Project telah diarsipkan (Take Down)");
        fetchProjects();
      }
    } catch (err) {
      toast.error("Error", "Gagal me-take down project");
    }
  }

  if (loading) return <div>Memuat data project...</div>;

  return (
    <div style={{ background: "#fff", border: "4px solid #000", borderRadius: "12px", boxShadow: "8px 8px 0px #000", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#000", color: "#fff", fontFamily: "Space Grotesk, sans-serif", fontWeight: 800 }}>
            <th style={{ padding: "16px" }}>Project</th>
            <th style={{ padding: "16px" }}>Owner</th>
            <th style={{ padding: "16px" }}>Category</th>
            <th style={{ padding: "16px" }}>Status</th>
            <th style={{ padding: "16px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} style={{ borderBottom: "2px solid #000" }}>
              <td style={{ padding: "16px" }}>
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{p._count.members} Anggota</div>
              </td>
              <td style={{ padding: "16px" }}>
                <div style={{ fontWeight: 700 }}>{p.owner.name}</div>
              </td>
              <td style={{ padding: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, background: "#F5F0E8", padding: "4px 8px", border: "1.5px solid #000", borderRadius: "4px" }}>
                  {p.category}
                </span>
              </td>
              <td style={{ padding: "16px" }}>
                <span style={{ 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  border: "2px solid #000",
                  background: p.status === "ARCHIVED" ? "#FF4D4D" : "#00D37F",
                  color: p.status === "ARCHIVED" ? "#fff" : "#000",
                  fontSize: "12px",
                  fontWeight: 800
                }}>
                  {p.status}
                </span>
              </td>
              <td style={{ padding: "16px" }}>
                {p.status !== "ARCHIVED" && (
                  <button
                    onClick={() => takeDown(p.id)}
                    style={{
                      padding: "8px 16px",
                      background: "#FF4D4D",
                      color: "#fff",
                      border: "2px solid #000",
                      borderRadius: "4px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "2px 2px 0px #000"
                    }}
                  >
                    Take Down
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
