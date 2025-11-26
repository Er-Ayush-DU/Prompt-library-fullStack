"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <SessionProvider>
          <header className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-xl border-b">
            <Navbar />
          </header>
          <main>
            {children}</main>
          <footer>
            <Footer />
            {/* Footer will be placed here */}
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}