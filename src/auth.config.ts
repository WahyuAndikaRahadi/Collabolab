import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
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
        token.username = (user as any).username ?? "";
        token.trustScore = (user as any).trustScore ?? 20;
        token.trustLevel = (user as any).trustLevel ?? "NEWCOMER";
        token.availStatus = (user as any).availStatus ?? "OPEN";
        token.onboardingDone = (user as any).onboardingDone ?? false;
        token.role = (user as any).role ?? "USER";
        token.isBlocked = (user as any).isBlocked ?? false;
      }
      if (trigger === "update") {
        if (session?.onboardingDone !== undefined) {
          token.onboardingDone = session.onboardingDone;
        }
        if (session?.trustScore !== undefined) {
          token.trustScore = session.trustScore;
        }
        if (session?.trustLevel !== undefined) {
          token.trustLevel = session.trustLevel;
        }
        if (session?.username !== undefined) {
          token.username = session.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.trustScore = token.trustScore as number;
        session.user.trustLevel = token.trustLevel as any;
        session.user.availStatus = token.availStatus as any;
        session.user.onboardingDone = token.onboardingDone as boolean;
        session.user.role = token.role as any;
        session.user.isBlocked = token.isBlocked as boolean;
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
