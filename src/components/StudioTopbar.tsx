// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";

// export default function StudioTopbar() {
//   const router = useRouter();
//   const qs = useSearchParams();
//   const [q, setQ] = useState(qs.get("search") || "");

//   useEffect(() => setQ(qs.get("search") || ""), [qs]);

//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams(q ? { search: q } : {});
//     router.push(`/studio/prompts${params.toString() ? `?${params}` : ""}`);
//   };

//   return (
//     <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
//       <div className="mx-auto max-w-6xl p-3 flex items-center gap-3">
//         <form onSubmit={submit} className="flex-1">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search your prompts…"
//             className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900"
//           />
//         </form>
//         <div className="flex items-center gap-2">
//           <a href="/prompts/upload" className="hidden md:inline-block rounded-md bg-blue-600 text-white px-3 py-2">+ Upload</a>
//           <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" title="Profile" />
//         </div>
//       </div>
//     </header>
//   );
// }
