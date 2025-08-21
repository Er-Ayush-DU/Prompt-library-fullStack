// components/Navbar.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Bell, ShoppingCart, MessageSquare, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-[#1d1c2b] text-white px-6 py-3 flex items-center justify-between shadow">
      {/* Left: Logo + Categories */}
      <div className="flex items-center gap-4">
        <Link href="" className="flex items-center gap-2 text-lg font-bold">
          <img src="/assets/logo.jpeg" alt="Logo" className="w-7 h-7" />
          PromptBase
        </Link>
        <button className="flex items-center gap-2 text-sm hover:text-pink-400">
          <Menu size={18} /> Categories
        </button>
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
      <nav className="flex items-center gap-5">
        <Link href="/jobs" className="hover:text-pink-400">Jobs</Link>
        <Link href="/create" className="hover:text-pink-400">Create</Link>
        <Link href="/sell" className="hover:text-pink-400">Sell</Link>

        <MessageSquare className="hover:text-pink-400 cursor-pointer" />
        <Bell className="hover:text-pink-400 cursor-pointer" />
        <div className="relative cursor-pointer">
          <ShoppingCart className="hover:text-pink-400" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">1</span>
        </div>

        {/* Clerk Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1 rounded bg-pink-500 hover:bg-pink-600">Login</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-3 py-1 rounded border border-pink-400 hover:bg-pink-600 ml-2">Sign Up</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
