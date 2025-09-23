import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      avatarUrl?: string | null;
      bio?: string | null;
      image?: string | null; // add if you're saving profile image
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    image?: string | null;
  }
}
