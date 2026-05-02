import { Bell, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-forge-300 dark:border-forge-600 bg-white dark:bg-forge-900 px-4 sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-heading font-bold text-xl text-loop-600">Loop</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium text-forge-600 cursor-pointer hover:text-forge-900 ml-auto md:ml-0">
        <MapPin className="w-4 h-4" />
        <span>Mysuru ▾</span>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forge-600" />
          <Input 
            type="text" 
            placeholder="Find scrap, pallets, offcuts…" 
            className="w-full pl-9 bg-forge-50 dark:bg-forge-800 border-none rounded-full h-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative text-forge-600 hover:text-forge-900">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-crit rounded-full border border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-loop-100 flex items-center justify-center text-loop-600 font-bold border border-loop-400">
          U
        </div>
      </div>
    </header>
  );
}
