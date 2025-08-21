import StudioSidebar from "@/components/StudioSidebar";
import StudioTopbar from "@/components/StudioTopbar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <StudioSidebar />
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <StudioTopbar />
        <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
