"use client";
import { useTheme } from "next-themes";
import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ onMenuClick }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format pathname for breadcrumbs (e.g. "/dashboard/scan" -> "Scan")
  const pageTitle = pathname?.split("/").pop() || "Overview";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
  const isOverview = pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:flex items-center text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Dashboard</span>
            <span className="mx-2 opacity-50">/</span>
            <span className={`font-medium ${isOverview ? "text-primary" : "text-foreground"}`}>
                {isOverview ? "Overview" : formattedTitle}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search */}
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-9 w-64 rounded-full bg-background/50 border border-input pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-border bg-background/50 hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Toggle Theme"
            >
                {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                    <Moon className="h-4 w-4 text-zinc-700" />
                )}
                <span className="sr-only">Toggle theme</span>
            </button>
          )}

          {/* Notifications */}
          <button className="p-2.5 rounded-full hover:bg-accent text-muted-foreground hover:text-primary transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse"></span>
          </button>

          {/* User Profile (Avatar Only) */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-transparent hover:ring-primary/30 transition-all cursor-pointer">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
