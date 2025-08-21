import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "pl_token"; // cookie ka naam tumhare project ke hisaab se

export function signJWT(payload: object) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return jwt.sign(payload, secret as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

export async function getUserFromCookies(): Promise<{ id: string; } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    return null;
  }
}

export async function clearAuthCookie() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}