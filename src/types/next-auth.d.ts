import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    oab?: string | null
    specialties?: string[]
    address?: string | null
    city?: string | null
    state?: string | null
    phone?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    oab?: string | null
    specialties?: string[]
  }
}