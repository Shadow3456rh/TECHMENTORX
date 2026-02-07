"use client";
import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">SecurAI</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How it Works
          </Link>

        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-4 animate-in slide-in-from-top-2">
          <Link href="#features" className="block text-sm font-medium py-2 hover:text-primary">Features</Link>
          <Link href="#how-it-works" className="block text-sm font-medium py-2 hover:text-primary">How it Works</Link>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <Link href="/login" className="flex items-center justify-center h-10 rounded-md border border-input bg-background px-4 hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                Log in
            </Link>
            <Link href="/signup" className="flex items-center justify-center h-10 rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90 text-sm font-medium">
                Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
