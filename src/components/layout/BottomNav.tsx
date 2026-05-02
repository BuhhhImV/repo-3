import Link from "next/link";
import { Home, Search, PlusCircle, MessageSquare, LayoutDashboard } from "lucide-react";

export function BottomNav() {
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Sell", href: "/sell", icon: PlusCircle },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="flex items-center justify-around h-16 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center w-full h-full text-forge-600 hover:text-loop-600"
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
