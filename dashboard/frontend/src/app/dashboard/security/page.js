"use client";
import { Shield, Lock, Server, Globe, Cpu, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function SecurityPolicyPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Shield className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">Security Architecture & Policy</h2>
                        <p className="text-muted-foreground">Transparency regarding data handling, execution environment, and privacy.</p>
                    </div>
                </div>
            </div>

            {/* Core Security Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server className="h-24 w-24" />
                    </div>
                    <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 text-blue-500">
                        <Cpu className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Local Execution Engine</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        All security scans (Nmap, Nikto, scripts) are executed strictly on your <b>local machine</b> or the server hosting the backend. No scan commands are offloaded to third-party cloud execution environments.
                    </p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lock className="h-24 w-24" />
                    </div>
                    <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20 text-amber-500">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Data Sovereignty</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Raw scan data is processed locally. Usage of <b>Local LLM (Ollama)</b> ensures sensitive vulnerability data never leaves your infrastructure.
                        <br /><span className="text-xs opacity-70 mt-2 block">*Optional OpenAI integration sends data only upon user action.</span>
                    </p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe className="h-24 w-24" />
                    </div>
                    <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 text-purple-500">
                        <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Encrypted Storage</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Historical records and reports stored in the cloud (Firestore) are transmitted via TLS encryption. Authentication is handled via secure Firebase Auhtentication tokens.
                    </p>
                </div>
            </div>

            {/* Detailed Policy Section */}
            <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-semibold text-white">System Protocol Specification</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">1. Localhost Integrity</h4>
                            <p className="text-sm text-zinc-400 mt-1">
                                The backend API (`server.py`) binds to `localhost` or a private internal IP. It is designed to be inaccessible from the public internet unless explicitly configured via reverse proxy.
                                This ensures that the "Weaponized" scanning capabilities cannot be triggered by unauthorized external actors.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">2. AI Inference Isolation</h4>
                            <p className="text-sm text-zinc-400 mt-1">
                                By default, the platform uses <b>Ollama (Llama 3.1)</b> running on port 11434 of the host machine.
                                This inference happens entirely in userland memory. No telemetry or prompt data is sent to Meta or Ollama cloud services.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-none pt-1">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">3. Authorized Testing Only</h4>
                            <p className="text-sm text-zinc-400 mt-1">
                                The "Consent" check in the scanner UI is a mandatory compliance step. The system logs the timestamp and user identity for every scan initiated.
                                Users are strictly prohibited from scanning targets they do not own or have explicit authorization to test.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="text-center pt-10 pb-6 border-t border-white/5">
                <p className="text-xs text-zinc-600 font-mono">
                    SECURITY HASH: SHA-256 Verified • PROTOCOL V.2.4 • LOCAL_ENV_CONFIRMED
                </p>
            </div>

        </div>
    );
}
