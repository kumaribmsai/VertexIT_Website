import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12h
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user || !user.isActive) return null;
        const ok = verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;
        // Update last login
        await db.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await db.auditLog.create({
          data: {
            userId: user.id,
            userName: user.name,
            action: "LOGIN_ADMIN",
            entity: "AdminUser",
            entityId: user.id,
          },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "vertexit-dev-secret-change-in-production",
};

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "COUNSELLOR" | "CONTENT_EDITOR";
