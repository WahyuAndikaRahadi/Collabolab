import type { ReactNode } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { SessionProviderWrapper } from "@/components/providers/SessionProvider";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProviderWrapper>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </SessionProviderWrapper>
  );
}
