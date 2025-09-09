"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, ShoppingCart, MessageSquare, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // profile menu
  const [catOpen, setCatOpen] = useState(false);   // categories menu
  const menuRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  // 🔹 Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Handle Sell button click with authentication check
  const handleSell = () => {
    if (status === "authenticated") {
      router.push("/upload?mode=sell");
    } else {
      alert("Please sign in to sell prompts");
      router.push("/login");
    }
  };

  return (
    <header className="bg-[#1d1c2b] text-white px-6 py-3 flex items-center justify-between shadow">
      {/* Left: Logo + Categories */}
      <div className="flex items-center gap-4 relative" ref={catRef}>
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <img src="/assets/logo.jpeg" alt="Logo" className="w-7 h-7" />
          PromptBase
        </Link>

        {/* Categories Button */}
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center gap-2 text-sm hover:text-pink-400 cursor-pointer"
        >
          <Menu size={18} /> Categories
        </button>

        {/* Categories Dropdown */}
        {catOpen && (
          <div className="absolute top-12 left-20 w-56 bg-[#2a2940] rounded-lg shadow-lg border border-gray-700 z-50">
            {[
              "Models",
              "Graphics",
              "Art",
              "Photography",
              "Games",
              "Logos",
              "AI",
              "Productivity",
            ].map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="block px-4 py-2 hover:bg-pink-500"
                onClick={() => setCatOpen(false)} // Close on click
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Middle: Search */}
      <div className="flex flex-1 max-w-xl mx-6">
        <input
          type="text"
          placeholder="Search prompts"
          className="flex-1 rounded-l-full px-4 py-2 bg-[#2a2940] text-sm focus:outline-none"
        />
        <button className="bg-gradient-to-r from-pink-400 to-orange-300 rounded-r-full px-4 flex items-center justify-center">
          🔍
        </button>
      </div>

      {/* Right: Links + Icons */}
      <nav className="flex items-center gap-5 relative">
        <Link href="/jobs" className="hover:text-pink-400">
          Jobs
        </Link>
        <button
          onClick={handleSell}
          className="hover:text-pink-400"
        >
          Sell
        </button>

        <MessageSquare className="hover:text-pink-400 cursor-pointer" />
        <Bell className="hover:text-pink-400 cursor-pointer" />
        <div className="relative cursor-pointer">
          <ShoppingCart className="hover:text-pink-400" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">1</span>
        </div>

        {/* Auth Buttons / User Menu */}
        {!session ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1 rounded bg-pink-500 hover:bg-pink-600"
            >
              Login
            </button>

            {/* <button
              onClick={() => router.push("/signup")}
              className="px-3 py-1 rounded border border-pink-400 hover:bg-pink-600"
            >
              Sign Up
            </button> */}
            
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            {/* Profile Avatar */}
            <img
              src={session.user?.image || "/assets/default-avatar.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-pink-400 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {/* Profile Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a2940] rounded-lg shadow-lg border border-gray-700 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-pink-500 rounded-t-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 hover:bg-pink-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-pink-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-2 hover:bg-pink-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 hover:bg-pink-500 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}