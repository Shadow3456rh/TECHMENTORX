"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  FileText
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Scan", href: "/dashboard/scan", icon: ScanLine },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Security Policy", href: "/dashboard/security", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    // In a real app, clear auth tokens here
    router.push("/login");
  };

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-4 left-4 z-50">
      {/* Modern Gradient Container with Hacker Effect */}
      <div className="flex-1 flex flex-col bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-r border-primary/20 relative group">

        {/* Hacker Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {/* Cyber Grid */}
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.1]"></div>

          {/* Moving Scanline */}
          <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scanline blur-sm"></div>

          {/* Ambient Corner Glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] opacity-20"></div>
        </div>

        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10 bg-white/5">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <ShieldCheck className="h-6 w-6 text-black" />
          </div>
          <span className="font-bold text-xl tracking-wide text-white drop-shadow-md">
            PentestIQ
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                  ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_10px_currentColor]"></div>
                )}
                <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-zinc-400 group-hover:text-white"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile (Refined Visibility) */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              AS
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate shadow-black drop-shadow-sm">Aryan Sharma</p>
              <p className="text-xs text-primary/80 font-medium truncate">Administrator</p>
            </div>
            <button onClick={handleSignOut} title="Sign Out" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <LogOut className="h-4 w-4 text-zinc-400 hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
