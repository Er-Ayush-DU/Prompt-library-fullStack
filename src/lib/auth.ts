import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/userModel/user";
// import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found");
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password");
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio
          };
        } catch (error) {
          throw new Error("Error during authentication: " + (error instanceof Error ? error.message : "Unknown error"));
        }

      }
    }
    )
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id || token.sub; // MongoDB _id ko token mein set karna
      }
      console.log("JWT callback token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id || token.sub;
        (session.user as any).avatarUrl = (token as any).avatarUrl || null;
        (session.user as any).bio = (token as any).bio || null;
        console.log("Session callback session:", session);
      }
      return session;
    }

  },

  pages: {
    signIn: "/login",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

}


// ✅ Helper function for API routes
export async function getUserFromCookies() {
  const session = await getServerSession(authOption);
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    avatarUrl: session.user.avatarUrl,
    bio: session.user.bio,
  };
}