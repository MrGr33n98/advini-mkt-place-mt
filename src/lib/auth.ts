import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { Session } from "next-auth";
import { mockSession } from "@/data/mock-auth";

const isDevelopment = process.env.NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  adapter: undefined, // Disable database adapter temporarily
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      if (isDevelopment) {
        return mockSession;
      }
      if (session.user && user) {
        session.user.id = (user as any).id;
      }
      return session;
    },
    async signIn() {
      if (isDevelopment) {
        return true;
      }
      return true;
    },
  },
};

