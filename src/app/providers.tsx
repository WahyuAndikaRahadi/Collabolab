"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/lib/toast";
import { AlertProvider } from "@/lib/alert";
import { MentionToastProvider } from "@/components/providers/MentionToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <AlertProvider>
        <ToastProvider>
          {children}
          <MentionToastProvider />
        </ToastProvider>
      </AlertProvider>
    </SessionProvider>
  );
}
