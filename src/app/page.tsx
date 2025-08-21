import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface HomeProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col">
    
      {/* Children control everything below navbar */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
