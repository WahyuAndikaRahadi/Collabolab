"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
  onUpdated: (newTitle: string, newDescription: string) => void;
};

export function ProjectSettingsModal({ projectId, initialTitle, initialDescription, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (title.length < 3) {
      toast.error("Error", "Judul project minimal 3 karakter.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Gagal update project");

      toast.success("Berhasil", "Detail project telah diperbarui.");
      onUpdated(title, description);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error", "Gagal memperbarui detail project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="⚙️ Pengaturan Project" size="md">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px" }}>
            Judul Project
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Hackathon Team Builder"
            style={{
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "6px",
              fontFamily: "inherit",
              fontSize: "14px",
              outline: "none",
              boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.05)"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px" }}>
            Deskripsi Project
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan projectmu lebih detail..."
            rows={6}
            style={{
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "6px",
              fontFamily: "inherit",
              fontSize: "14px",
              outline: "none",
              resize: "none",
              boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.05)"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
          <Button variant="secondary" onClick={onClose} type="button">
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
