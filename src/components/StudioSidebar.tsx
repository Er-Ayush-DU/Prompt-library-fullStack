// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";

// const items = [
//   { name: "Dashboard", href: "/studio" },
//   { name: "My Prompts", href: "/studio/prompts" },
//   { name: "Upload", href: "/studio/upload" },
//   { name: "Earnings", href: "/studio/earnings" }, // (optional page)
//   { name: "Settings", href: "/studio/settings" }, // (optional page)
//   { name: "Help", href: "/studio/help" }, // (optional page)
// ];

// export default function StudioSidebar() {
//   const pathname = usePathname();
//   return (
//     <aside className="w-64 shrink-0 bg-gray-950 text-gray-100 min-h-screen border-r border-gray-800">
//       <div className="p-4 text-xl font-bold">Prompt Studio</div>
//       <nav className="flex flex-col gap-1 p-2">
//         {items.map((it) => (
//           <Link
//             key={it.href}
//             href={it.href}
//             className={clsx(
//               "px-4 py-2 rounded-md hover:bg-gray-900",
//               pathname === it.href && "bg-gray-900"
//             )}
//           >
//             {it.name}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }
