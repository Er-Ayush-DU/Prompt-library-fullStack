// //src/app/sell(create)/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import PromptCard from "@/components/PromptCard";
// import session from "next-auth/react";
// import { useSession } from "next-auth/react";

// export default function Sell() {
//   const [prompts, setPrompts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const userId = "507f1f77bcf86cd799439011"; // Dummy userId, replace with session.user.id

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       try {
//         const res = await fetch(`/api/dashboard?userId=${userId}`);
//         const data = await res.json();
//         setPrompts(data.prompts.filter((p: any) => p.createdBy._id === userId && p.isForSale));
//       } catch (error) {
//         console.error("Error fetching prompts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPrompts();
//   }, [userId]);

//   if (loading) return <p className="container mx-auto p-4">Loading...</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Sell Your Prompts</h2>
//       {prompts.length === 0 ? (
//         <p>No prompts available for sale.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {prompts.map((prompt) => (
//             <PromptCard key={prompt._id} prompt={prompt} session={session} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }