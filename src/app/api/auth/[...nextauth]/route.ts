import NextAuth from "next-auth";
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
        console.log("🔥 Incoming credentials:", credentials);
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          console.log("❌ User not found");
          return null;
        }
        const isMatch = await bcrypt.compare(credentials?.password || "", user.password);
        console.log("🔑 Password match:", isMatch);
        if (isMatch) {
          return { id: user._id.toString(), name: user.name, email: user.email };
        }
        console.log("❌ Invalid password"); 
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };