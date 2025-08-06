import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { Session } from "next-auth"
import { mockSession, mockUser } from "@/data/mock-auth"

const isDevelopment = process.env.NODE_ENV === "development"

const handler = NextAuth({
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
        return mockSession
      }
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn() {
      if (isDevelopment) {
        return true
      }
      return true
    },
  },
})

export const { GET, POST } = handler