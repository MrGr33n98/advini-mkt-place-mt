import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { User } from "next-auth";

export async function getSessionUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

