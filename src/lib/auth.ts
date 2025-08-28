// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// const COOKIE = "pl_token"; // cookie ka naam tumhare project ke hisaab se

// export function signJWT(payload: object) {
//   const secret = process.env.JWT_SECRET;
//   const expiresIn = process.env.JWT_EXPIRES || "7d";

//   if (!secret) {
//     throw new Error("JWT_SECRET is not defined in the environment variables.");
//   }

//   return jwt.sign(payload, secret as jwt.Secret, { expiresIn } as jwt.SignOptions);
// }

// export async function getUserFromCookies(): Promise<{ id: string; } | null> {
//   const token = (await cookies()).get(COOKIE)?.value;
//   if (!token) return null;
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!) as any;
//   } catch {
//     return null;
//   }
// }

// export async function clearAuthCookie() {
//   (await cookies()).set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
// }

import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/userModel/user";
import { email } from "zod";
import bcrypt from "bcryptjs";

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
        token.id = user.id
      }
      return token;
    },
    async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      }

    },

    pages:{
      signIn: "/login",
      error: "/login"
    },

    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,

  }