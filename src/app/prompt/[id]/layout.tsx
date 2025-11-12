// app/prompt/[id]/layout.tsx
import { generateMetadata } from "./metadata";
import "./page";

export { generateMetadata };
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}