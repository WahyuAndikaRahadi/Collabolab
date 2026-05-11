import { AdminProjectsClient } from "@/components/admin/AdminProjectsClient";
import { SectionLabel } from "@/components/ui/DecorativeElements";

export default function AdminProjectsPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px" }}>
        <SectionLabel>📁 CONTENT OVERSIGHT</SectionLabel>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "40px", margin: "12px 0" }}>
          Project Oversight
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "16px", fontWeight: 600 }}>
          Pantau semua project yang dibuat user. Take down project yang melanggar ketentuan.
        </p>
      </header>

      <AdminProjectsClient />
    </div>
  );
}
