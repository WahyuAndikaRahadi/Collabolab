import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { SectionLabel } from "@/components/ui/DecorativeElements";

export default function AdminUsersPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px" }}>
      <header style={{ marginBottom: "48px" }}>
        <div style={{ display: "inline-block", background: "#FF4D4D", color: "#000", padding: "4px 12px", borderRadius: "2px", fontWeight: 900, fontSize: "12px", marginBottom: "16px" }}>
           POPULATION_CONTROL_PROTOCOL_ACTIVE
        </div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "40px", margin: "0 0 12px 0", color: "#000" }}>
          User Management
        </h1>
        <p style={{ color: "#888", fontSize: "18px", fontWeight: 500 }}>
          Manage access levels, adjust trust parameters, and enforce community standards.
        </p>
      </header>

      <AdminUsersClient />
    </div>
  );
}
