// components/MasonryGrid.tsx
"use client";

import Masonry from "react-masonry-css";
import PromptCard from "./PromptCard";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

interface MasonryGridProps {
  prompts: any[];
  session: any;
}

export default function MasonryGrid({ prompts, session }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4"
      columnClassName="bg-clip-padding"
    >
      {prompts.map((prompt) => (
        <div key={prompt._id}>
          <PromptCard prompt={prompt} />
        </div>
      ))}
    </Masonry>
  );
}