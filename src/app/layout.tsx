import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper"; // Wrapper
import Header from "@/components/Header"; // Header component

export const metadata: Metadata = {
  title: "My Studio App",
  description: "A modern app with Likes, Comments, and Dashboard",
  keywords: "studio, dashboard, seo, likes, comments",
  openGraph: {
    title: "My Studio App",
    description: "Explore our studio dashboard and features",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "My Studio App",
    images: ["/og-image.jpg"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <SessionWrapper>
          <Header /> {/* Permanent navbar via Header */}
          <main>{children}</main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            &copy; 2025 My Studio App
          </footer>
        </SessionWrapper>
      </body>
    </html>
  );
}