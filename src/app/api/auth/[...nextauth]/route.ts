import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/db";
import User from "@/models/userModel/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials?.password || "", user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,        // 👈 ensure image
          avatarUrl: user.avatarUrl ?? null, // 👈 if you have avatarUrl field
          bio: user.bio ?? null,
        };
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image ?? null;
        token.avatarUrl = user.avatarUrl ?? null;
        token.bio = user.bio ?? null;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.image = token.image as string | null;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
        session.user.avatarUrl = token.avatarUrl as string | null;
        session.user.bio = token.bio as string | null;
      }
      return session;
    },
  },

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
