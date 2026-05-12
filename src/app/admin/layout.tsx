'use client'

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
      <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E8", color: "#000", position: "relative", fontFamily: "Space Grotesk, sans-serif" }}>
        
        {/* Admin Sidebar */}
        <aside style={{ 
          width: "280px", 
          background: "#FFFFFF", 
          borderRight: "4px solid #000", 
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 10,
          boxShadow: "4px 0 0 rgba(0,0,0,0.05)"
        }}>
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
              <span style={{ fontWeight: 900, fontSize: "22px", color: "#000", letterSpacing: "-0.5px" }}>CollaboLab</span>
            </Link>
            <div style={{ fontSize: "10px", fontWeight: 800, color: "#666", letterSpacing: "1px", marginBottom: "16px" }}>ADMIN CONTROL PANEL</div>

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
                      gap: "14px",
                      padding: "14px 18px",
                      background: isActive ? "#FFE500" : "transparent",
                      border: "2px solid",
                      borderColor: isActive ? "#000" : "transparent",
                      borderRadius: "4px",
                      color: "#000",
                      fontWeight: 800,
                      boxShadow: isActive ? "4px 4px 0px #000" : "none",
                      transform: isActive ? "translate(-2px, -2px)" : "none",
                      transition: "all 0.1s ease"
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
             <div style={{ padding: "16px", background: "#F5F0E8", border: "2px solid #000", borderRadius: "4px", fontSize: "12px" }}>
                <div style={{ color: "#000", fontWeight: 800, marginBottom: "4px" }}>SYSTEM STATUS</div>
                <div style={{ color: "#00D37F", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
                   <span style={{ width: "8px", height: "8px", background: "#00D37F", borderRadius: "50%", border: "1px solid #000" }}></span>
                   All Systems Operational
                </div>
             </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                width: "100%",
                padding: "14px",
                background: "#000",
                color: "#FFE500",
                borderRadius: "4px",
                fontWeight: 900,
                fontSize: "14px",
                border: "2px solid #000",
                boxShadow: "4px 4px 0px #FFE500",
                cursor: "pointer",
                transition: "all 0.1s ease"
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px, 2px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
            >
              LOGOUT ADMIN SESSION
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
           {/* Top Bar */}
           <header style={{ 
              height: "72px", 
              borderBottom: "4px solid #000", 
              padding: "0 40px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              background: "#FFFFFF",
           }}>
              <div style={{ color: "#000", fontWeight: 800, fontSize: "14px", letterSpacing: "0.5px" }}>
                 {pathname.substring(1).split('/').join(' / ').toUpperCase() || 'DASHBOARD'}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <div style={{ background: "#FFFFFF", border: "2px solid #000", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: 900, boxShadow: "2px 2px 0px #000" }}>
                    Collabolab
                 </div>
              </div>
           </header>

           <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
             {children}
           </main>
        </div>
      </div>
    </AdminGuard>
  );
}
