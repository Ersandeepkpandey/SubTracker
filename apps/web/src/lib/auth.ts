import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@subtrack/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existing) {
        const trialStart = new Date();
        const trialEnd = new Date(trialStart);
        trialEnd.setDate(trialEnd.getDate() + 14);

        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account?.providerAccountId,
            gmailToken: account?.access_token
              ? ({
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                } as object)
              : undefined,
            gmailConnected: !!account?.access_token,
            trialStartedAt: trialStart,
            trialEndsAt: trialEnd,
            subscriptionStatus: "trial",
          },
        });
      } else if (account?.access_token) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            gmailToken: {
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
            },
            gmailConnected: true,
          },
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        token.userId = dbUser?.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.userId as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: { sameSite: "lax", path: "/", secure: false },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
    },
    state: {
      name: "next-auth.state",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: false, maxAge: 900 },
    },
  },
};
