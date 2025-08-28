"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StudioSidebar from "@/components/StudioSidebar";
import StudioTopbar from "@/components/StudioTopbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === "/"; // ✅ only home page check

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Navbar har page par dikhna chahiye */}
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          {/* Sidebar & Topbar sirf home par */}
          {isHome && (
            <>
              <StudioSidebar />
              <StudioTopbar />
            </>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
