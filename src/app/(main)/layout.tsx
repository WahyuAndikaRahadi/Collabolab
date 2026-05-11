'use client'

import type { ReactNode } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";

const PROTECTED_ROUTES = ["/explore", "/dashboard", "/project", "/profile", "/settings", "/onboarding", "/ai-hub"];

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  const content = (
    <>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </>
  );

  if (isProtected) {
    return <AuthGuard>{content}</AuthGuard>;
  }

  return content;
}
