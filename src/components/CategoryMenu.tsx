// components/CategoryMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const categories = [
  { name: "image", slug: "image" },
  { name: "video", slug: "video" },
  { name: "audio", slug: "audio" },
  { name: "clips", slug: "clips" },
  { name: "games", slug: "games" },
  { name: "webapps", slug: "webapps" },
  { name: "ui design", slug: "ui_design" },
  { name: "other", slug: "other" },
];


export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-pink-300 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
        <span className="hidden md:inline">Categories</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-12 w-56 bg-purple-900 rounded-lg shadow-xl z-50 p-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-white hover:bg-purple-800 rounded-md transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}