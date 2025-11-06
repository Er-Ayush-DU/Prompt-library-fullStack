"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, ShoppingCart, MessageSquare, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CategoryMenu from "./CategoryMenu";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSell = () => {
    if (status === "authenticated") {
      router.push("/upload?mode=sell");
    } else {
      alert("Please sign in to sell prompts");
      router.push("/login");
    }
  };

  return (
    <header className="bg-[#1d1c2b] text-white px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Left: Logo + Categories */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <img src="/assets/logo.jpeg" alt="Logo" className="w-7 h-7 rounded-full" />
          PromptLibrary
        </Link>
        <CategoryMenu />
      </div>

      {/* Middle: Search */}
      {/* <div className="flex flex-1 max-w-xl mx-6">
        <input
          type="text"
          placeholder="Search prompts"
          className="flex-1 rounded-l-full px-4 py-2 bg-[#2a2940] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button className="bg-gradient-to-r from-pink-400 to-orange-300 rounded-r-full px-4 flex items-center justify-center hover:from-pink-500 hover:to-orange-400 transition">
          Search
        </button>
      </div> */}

      <span>
        <SearchBar />
      </span>


      {/* Right: Links + Icons */}
      <nav className="flex items-center gap-5 relative">
        <Link href="/jobs" className="hover:text-pink-400 transition">Jobs</Link>
        <button onClick={handleSell} className="hover:text-pink-400 transition">Sell</button>

        <MessageSquare className="hover:text-pink-400 cursor-pointer transition" />
        <Bell className="hover:text-pink-400 cursor-pointer transition" />
        <div className="relative cursor-pointer">
          <ShoppingCart className="hover:text-pink-400 transition" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">1</span>
        </div>

        {/* Auth */}
        {!session ? (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 rounded bg-pink-500 hover:bg-pink-600 transition text-sm font-medium"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <img
              src={session.user?.image || "/assets/default-avatar.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-pink-400 cursor-pointer hover:border-pink-300 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a2940] rounded-lg shadow-xl border border-gray-700 z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-pink-500 rounded-t-lg transition" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-pink-500 transition" onClick={() => setMenuOpen(false)}>Settings</Link>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-pink-500 transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/" className="block px-4 py-2 hover:bg-pink-500 transition" onClick={() => setMenuOpen(false)}>Home</Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 hover:bg-pink-500 rounded-b-lg transition"
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