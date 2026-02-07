"use client";
import Link from "next/link";
import { Shield, Mail, Lock, User, ArrowRight, Server, Globe, Database } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock auth delay
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] opacity-20 animate-pulse delay-75"></div>
      </div>

      {/* Left Panel: Cyber Art (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col relative bg-zinc-900 border-r border-white/5 overflow-hidden">
        {/* Hacker Effects */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline blur-sm h-[50%]"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center">
            {/* Animated Icon Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10 opacity-80">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm animate-float">
                    <Server className="h-8 w-8 text-primary" />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}>
                    <Globe className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm animate-float" style={{animationDelay: '0.5s'}}>
                    <Database className="h-8 w-8 text-purple-400" />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm animate-float" style={{animationDelay: '1.5s'}}>
                    <Shield className="h-8 w-8 text-blue-400" />
                </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Elite Guard</span>
            </h1>
            <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                Create your account to start monitoring, analyzing, and securing your digital assets instantly.
            </p>
        </div>
        
        {/* Bottom copyright */}
        <div className="p-8 text-center text-zinc-600 text-sm relative z-10">
            © 2024 TechMentorX Security Systems. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-8 w-8 text-black" />
                </div>
            </div>

            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                <p className="mt-2 text-zinc-400">Setup your secure admin console.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="relative group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 pointer-events-none transition-colors group-focus-within:text-primary text-zinc-500">
                        <User className="h-5 w-5" />
                    </div>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        placeholder="Full Name"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 pointer-events-none transition-colors group-focus-within:text-primary text-zinc-500">
                        <Mail className="h-5 w-5" />
                    </div>
                    <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        placeholder="work@email.com"
                    />
                </div>
                
                <div className="relative group">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 pointer-events-none transition-colors group-focus-within:text-primary text-zinc-500">
                        <Lock className="h-5 w-5" />
                    </div>
                    <input 
                        type="password" 
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                        placeholder="Create Password"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-emerald-500 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>Initialize System</span>
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-zinc-500 text-sm">
                    Already have access?{" "}
                    <Link href="/login" className="text-primary hover:text-emerald-400 font-medium hover:underline transition-colors">
                        Authenticate (Log In)
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
