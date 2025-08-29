"use client"; // Yeh client-side component banata hai

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}