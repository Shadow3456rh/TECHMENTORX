"use client";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            setError("");
            await signInWithGoogle();
            // AuthContext state change will trigger useEffect redirect
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            setError("Failed to sign in with Google. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-black">
            <Navbar />
            <div className="flex-1 grid lg:grid-cols-2 overflow-hidden relative">

                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-20 animate-pulse delay-75"></div>
                </div>

                {/* Left Panel: Cyber Art (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col relative bg-zinc-900 border-r border-white/5 overflow-hidden">
                    {/* Hacker Effects */}
                    <div className="absolute inset-0 bg-dot-pattern opacity-[0.05]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline blur-sm h-[50%]"></div>

                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-8 animate-float">
                            <Shield className="h-12 w-12 text-black" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Digital Future</span>
                        </h1>
                        <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                            Advanced AI-powered vulnerability scanning and infrastructure protection for the modern web.
                        </p>
                    </div>

                    {/* Bottom copyright */}
                    <div className="p-8 text-center text-zinc-600 text-sm relative z-10">
                        © 2024 TechMentorX Security Systems. All rights reserved.
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
                    <div className="w-full max-w-md space-y-8">

                        {/* Mobile Logo (Visible only on small screens) */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="h-8 w-8 text-black" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                            <p className="mt-2 text-zinc-400">Sign in to access the command center.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Google Sign-In Button */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 rounded-xl transition-all hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                            >
                                {googleLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="group-hover:text-white transition-colors">Sign in with Google</span>
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
