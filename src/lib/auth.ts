import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { compareSync } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  basePath: "/api/auth",
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;
        if (!user.emailVerified) return null;

        const isValid = compareSync(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          trustScore: user.trustScore,
          trustLevel: user.trustLevel,
          availStatus: user.availStatus,
          onboardingDone: user.onboardingDone,
          role: user.role,
          isBlocked: user.isBlocked,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        try {
          // Use raw query to bypass stale Prisma client validation (Next.js/Turbopack cache issues)
          // We use queryRawUnsafe to ensure we get the latest fields directly from DB
          const results = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id, role, "trustScore", "trustLevel", "availStatus", "onboardingDone", "isBlocked" FROM "User" WHERE id = $1`,
            token.id
          );

          const dbUser = results && results[0];

          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
            session.user.trustScore = dbUser.trustScore;
            session.user.trustLevel = dbUser.trustLevel;
            session.user.availStatus = dbUser.availStatus;
            session.user.onboardingDone = dbUser.onboardingDone;
            session.user.isBlocked = dbUser.isBlocked;
          }
        } catch (error) {
          console.error("Session sync error (falling back to token):", error);
          // Fallback to token data if DB fetch fails
          session.user.id = token.id as string;
          session.user.role = token.role as any;
        }
      }
      return session;
    },
  },
});
