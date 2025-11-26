
// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import { Heart, MessageCircle } from "lucide-react";

// interface PromptCardProps {
//   prompt: any;
// }

// export default function PromptCard({ prompt }: PromptCardProps) {
//   const [likes, setLikes] = useState(prompt.likesCount || 0);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isPurchased, setIsPurchased] = useState(false);
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (!session?.user?.id) return;
//     const checkPurchase = async () => {
//       try {
//         const res = await fetch(`/api/check-purchased?promptId=${prompt._id}&userId=${session.user.id}`);
//         const data = await res.json();
//         setIsPurchased(data.purchased);
//       } catch (err) {}
//     };
//     checkPurchase();
//   }, [session, prompt._id]);

//   const handleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (status !== "authenticated" || isLiking) return;
//     setIsLiking(true);
//     try {
//       const res = await fetch("/api/like", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ promptId: prompt._id, userId: session?.user?.id }),
//       });
//       if (res.ok) setLikes(likes + 1);
//     } catch (error) {} finally {
//       setIsLiking(false);
//     }
//   };

//   return (
//     <Link href={`/prompt/${prompt._id}`} className="group block">
//       <div className="group relative bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
//         {/* Image */}
//         <div className="relative aspect-auto">
//           <Image
//             src={prompt.previewUrl}
//             alt={prompt.title}
//             width={400}
//             height={600}
//             className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
//             priority
//             unoptimized
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>

//         {/* Hover Overlay */}
//         <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <h3 className="font-bold text-lg line-clamp-1">{prompt.title}</h3>
//           <p className="text-sm opacity-90 line-clamp-2 mb-2">{prompt.description}</p>

//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleLike}
//                 className="flex items-center gap-1 hover:scale-110 transition"
//                 disabled={isLiking}
//               >
//                 <Heart className="w-5 h-5" />
//                 <span>{likes}</span>
//               </button>
//               <div className="flex items-center gap-1">
//                 <MessageCircle className="w-5 h-5" />
//                 <span>{prompt.commentsCount || 0}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <span className="text-xs">@{prompt.creator?.username || "artist"}</span>
//               </div>
//             </div>

//             {/* Price Badge */}
//             {prompt.price > 0 && !isPurchased && (
//               <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">
//                 ₹{prompt.price}
//               </span>
//             )}
//             {isPurchased && (
//               <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Owned</span>
//             )}
//           </div>
//         </div>

//         {/* Always Visible Footer */}
//         {/* <div className="p-3 border-t border-gray-100 bg-white">
//           <div className="flex items-center justify-between text-xs text-gray-600">
//             <span className="font-medium">@{prompt.creator?.username || "artist"}</span>
//             <span className="text-gray-400">AI Art</span>
//           </div>
//         </div> */}
//       </div>
//     </Link>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

interface PromptCardProps {
  prompt: any;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [likes, setLikes] = useState(prompt.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { data: session, status } = useSession();

  // Detect if preview is video
  const isVideo =
    typeof prompt.previewUrl === "string" &&
    (prompt.previewUrl.endsWith(".mp4") ||
      prompt.previewUrl.endsWith(".mov") ||
      prompt.previewUrl.endsWith(".webm"));

  useEffect(() => {
    if (!session?.user?.id) return;
    const checkPurchase = async () => {
      try {
        const res = await fetch(`/api/check-purchased?promptId=${prompt._id}&userId=${session.user.id}`);
        const data = await res.json();
        setIsPurchased(data.purchased);
      } catch (err) {}
    };
    checkPurchase();
  }, [session, prompt._id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== "authenticated" || isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt._id, userId: session?.user?.id }),
      });
      if (res.ok) setLikes(likes + 1);
    } catch (error) {} finally {
      setIsLiking(false);
    }
  };

  return (
    <Link href={`/prompt/${prompt._id}`} className="group block">
      <div className="group relative bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">

        {/* Media (Image or Video) */}
        <div className="relative aspect-auto">

          {/* If it's a video → show video thumbnail */}
          {isVideo ? (
            <video
              src={prompt.previewUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={prompt.previewUrl}
              alt={prompt.title}
              width={400}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              unoptimized
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-bold text-lg line-clamp-1">{prompt.title}</h3>
          <p className="text-sm opacity-90 line-clamp-2 mb-2">{prompt.description}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:scale-110 transition"
                disabled={isLiking}
              >
                <Heart className="w-5 h-5" />
                <span>{likes}</span>
              </button>

              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                <span>{prompt.commentsCount || 0}</span>
              </div>

              <span className="text-xs">@{prompt.creator?.username || "artist"}</span>
            </div>

            {!isPurchased && prompt.price > 0 && (
              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">
                ₹{prompt.price}
              </span>
            )}

            {isPurchased && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Owned</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
