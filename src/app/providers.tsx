"use client";

import { SessionProvider } from "next-auth/react";
import { MentionToastProvider } from "@/components/providers/MentionToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      {children}
      <MentionToastProvider />
    </SessionProvider>
  );
}
