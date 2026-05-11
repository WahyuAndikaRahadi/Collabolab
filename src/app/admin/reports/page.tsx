import { AdminReportsClient } from "@/components/admin/AdminReportsClient";
import { SectionLabel } from "@/components/ui/DecorativeElements";

export default function AdminReportsPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "80px" }}>
      <header style={{ marginBottom: "48px" }}>
        <div style={{ display: "inline-block", background: "#FFE500", color: "#000", padding: "4px 12px", borderRadius: "2px", fontWeight: 900, fontSize: "12px", marginBottom: "16px", border: "2px solid #000" }}>
           SECURITY_OVERSIGHT_PROTOCOL
        </div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "40px", margin: "0 0 12px 0", color: "#000" }}>
          Security Reports
        </h1>
        <p style={{ color: "#888", fontSize: "18px", fontWeight: 500 }}>
          Monitor community reports and enforce ecosystem safety standards.
        </p>
      </header>

      <AdminReportsClient />
    </div>
  );
}
