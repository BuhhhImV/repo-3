import { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-forge-50 dark:bg-forge-900 text-forge-900 dark:text-forge-50 overflow-hidden">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 scroll-smooth">
          {children}
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-forge-300 dark:border-forge-600 bg-white dark:bg-forge-900 pb-safe">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
