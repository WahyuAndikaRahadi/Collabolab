import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// Note: prisma cannot be imported here (Edge-compatible config). DB refresh is handled via trigger.

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      // Placeholder for Edge compatibility. 
      // The real authorize will be defined in lib/auth.ts
      authorize: async () => null,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  basePath: "/api/auth",
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.trustScore = (user as any).trustScore ?? 20;
        token.trustLevel = (user as any).trustLevel ?? "NEWCOMER";
        token.availStatus = (user as any).availStatus ?? "OPEN";
        token.onboardingDone = (user as any).onboardingDone ?? false;
      }
      // When session.update() is called from the client, refresh onboardingDone
      if (trigger === "update" && session?.onboardingDone !== undefined) {
        token.onboardingDone = session.onboardingDone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.trustScore = token.trustScore as number;
        session.user.trustLevel = token.trustLevel as any;
        session.user.availStatus = token.availStatus as any;
        session.user.onboardingDone = token.onboardingDone as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
