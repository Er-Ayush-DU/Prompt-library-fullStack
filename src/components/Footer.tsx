// components/Footer.tsx
"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-950 via-black to-pink-950 text-white border-t border-purple-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                PromptHub
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Discover, buy, and own stunning AI-generated prompts from creators worldwide.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/prompts" className="text-gray-300 hover:text-white transition">Browse Prompts</Link></li>
              <li><Link href="/upload" className="text-gray-300 hover:text-white transition">Create Prompt</Link></li>
              <li><Link href="/profile" className="text-gray-300 hover:text-white transition">Profile</Link></li>
              <li><Link href="/admin" className="text-gray-300 hover:text-white transition">Admin</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/image" className="text-gray-300 hover:text-white transition">Image</Link></li>
              <li><Link href="/category/video" className="text-gray-300 hover:text-white transition">Video</Link></li>
              <li><Link href="/category/audio" className="text-gray-300 hover:text-white transition">Audio</Link></li>
              <li><Link href="/category/games" className="text-gray-300 hover:text-white transition">Games</Link></li>
              <li><Link href="/category/other" className="text-gray-300 hover:text-white transition">Other</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm text-gray-300 mb-4">
              Have questions? Reach out anytime.
            </p>
            <Link href="mailto:hello@prompthub.com" className="flex items-center gap-2 text-purple-300 hover:text-white">
              <Mail size={20} />
              hello@prompthub.com
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-800/50 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 PromptHub. All rights reserved.</p>
          <p className="mt-2">
            Made by Ayush Tiwari <span className="text-pink-500">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}