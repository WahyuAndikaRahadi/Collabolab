import { AdminReportsClient } from "@/components/admin/AdminReportsClient";
import { SectionLabel } from "@/components/ui/DecorativeElements";

export default function AdminReportsPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px" }}>
        <SectionLabel>🚩 DISCIPLINARY ACTIONS</SectionLabel>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "40px", margin: "12px 0" }}>
          User Reports
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "16px", fontWeight: 600 }}>
          Daftar laporan dari pengguna terkait project atau perilaku user lain.
        </p>
      </header>

      <AdminReportsClient />
    </div>
  );
}
