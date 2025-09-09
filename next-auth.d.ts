import { DefaultSession } from "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      avatarUrl?: string | null;
      bio?: string | null;
    } & DefaultSession["user"];
  }
}