import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Content — offset by sidebar on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 w-full max-w-3xl mx-auto">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
