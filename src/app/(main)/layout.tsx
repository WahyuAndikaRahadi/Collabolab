import type { ReactNode } from "react";
import { Navbar } from "@/components/ui/Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </>
  );
}
