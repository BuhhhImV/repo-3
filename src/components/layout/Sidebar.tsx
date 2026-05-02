import Link from "next/link";
import { Home, Search, PlusCircle, MessageSquare, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Sell Material", href: "/sell", icon: PlusCircle },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <aside className="w-[240px] flex-col flex border-r border-forge-300 dark:border-forge-600 bg-white dark:bg-forge-900 h-full">
      <div className="h-14 flex items-center px-6 border-b border-forge-300 dark:border-forge-600">
        <Link href="/" className="font-heading font-bold text-2xl text-loop-600 tracking-tight">
          Loop
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-forge-600 hover:text-forge-900 hover:bg-forge-50 dark:hover:bg-forge-800 font-medium transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-forge-300 dark:border-forge-600">
        <div className="bg-diverted-100 rounded-lg p-4 text-center">
          <div className="text-diverted-600 font-bold font-heading mb-1 text-sm">Global Impact</div>
          <div className="text-diverted-900 font-mono text-xl font-bold tracking-tight">24,580 kg</div>
          <div className="text-diverted-600 text-xs mt-1">diverted this month</div>
        </div>
      </div>
    </aside>
  );
}
