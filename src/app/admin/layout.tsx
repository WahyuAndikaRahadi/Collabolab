'use client'

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/auth/AdminGuard";
import { NoiseTexture } from "@/components/ui/DecorativeElements";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "User Management", icon: "👥" },
  { href: "/admin/projects", label: "Project Oversight", icon: "📁" },
  { href: "/admin/reports", label: "Reports", icon: "🚩" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E8", position: "relative" }}>
        <NoiseTexture />
        
        {/* Admin Sidebar */}
        <aside style={{ 
          width: "280px", 
          background: "#fff", 
          borderRight: "4px solid #000", 
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 10
        }}>
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
              <span style={{ background: "#FFE500", border: "2px solid #000", padding: "4px", borderRadius: "4px", fontWeight: 900, boxShadow: "2px 2px 0px #000" }}>🤝</span>
              <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "20px", color: "#000" }}>CollaboAdmin</span>
            </Link>

            <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ADMIN_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      background: isActive ? "#FFE500" : "transparent",
                      border: "2px solid #000",
                      borderRadius: "8px",
                      color: "#000",
                      fontWeight: 800,
                      fontFamily: "Space Grotesk, sans-serif",
                      boxShadow: isActive ? "4px 4px 0px #000" : "none",
                      transform: isActive ? "translate(-2px, -2px)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ marginTop: "auto" }}>
            <Link 
              href="/dashboard"
              style={{
                textDecoration: "none",
                display: "block",
                textAlign: "center",
                padding: "12px",
                background: "#000",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "14px",
                fontFamily: "Space Grotesk, sans-serif"
              }}
            >
              Kembali ke App
            </Link>
          </div>
        </aside>

        {/* Admin Content */}
        <main style={{ flex: 1, padding: "40px", position: "relative", zIndex: 1 }}>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
