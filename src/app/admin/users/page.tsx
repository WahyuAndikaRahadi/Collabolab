import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { SectionLabel } from "@/components/ui/DecorativeElements";

export default function AdminUsersPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "32px" }}>
        <SectionLabel>👥 POPULATION CONTROL</SectionLabel>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "40px", margin: "12px 0" }}>
          User Management
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "16px", fontWeight: 600 }}>
          Kelola hak akses user, sesuaikan trust score, atau blokir akun yang melanggar aturan.
        </p>
      </header>

      <AdminUsersClient />
    </div>
  );
}
