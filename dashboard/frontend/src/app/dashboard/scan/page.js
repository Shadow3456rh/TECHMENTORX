"use client";
import { useState } from "react";
import { Play, Terminal, Shield, Mic, Server, Activity, Cpu, FileText, ArrowRight, CheckSquare, ArrowLeft } from "lucide-react";

const SYSTEM_MODULES = [
  "Host Discovery (Network Reconnaissance)",
  "Basic TCP Port Scan",
  "Full TCP Port Scan (1–65535)",
  "UDP Port Scan (Top Ports)",
  "Service & Version Detection",
  "Aggressive Enumeration (-A Scan)",
  "Operating System Detection",
  "Vulnerability Scanning (NSE Scripts)",
  "Authentication & Weak Configuration Checks",
  "Firewall & IDS Behavior Analysis",
  "SSL / TLS Security Testing",
  "Web Vulnerability Scanning (Nikto)",
  "Web Attack Surface Enumeration",
  "Denial-of-Service Exposure Check (Safe)",
  "Privilege Escalation Indicator Analysis",
  "Credential & Password Policy Audit",
  "Listening Services & Trust Boundary Analysis",
  "Container / Virtualization Exposure Check",
  "Persistence & Malware Indicator Checks",
  "Network Stack & Routing Analysis",
  "Automated Risk Assessment"
];

export default function ScanPage() {
  const [scanMode, setScanMode] = useState("selection"); // selection, manual, voice
  const [step, setStep] = useState(1); // 1: Config, 2: Modules, 3: Execution
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedModules, setSelectedModules] = useState(SYSTEM_MODULES); // Default all selected
  
  // Configuration State
  const [config, setConfig] = useState({
      testType: "Network Scan",
      targetType: "Localhost Application",
      targetInput: "127.0.0.1",
      intensity: "Standard (Recommended)",
      outputFormat: "Dashboard View"
  });

  const handleNext = () => {
    setStep(2);
  };

  const toggleModule = (module) => {
    if (selectedModules.includes(module)) {
        setSelectedModules(selectedModules.filter(m => m !== module));
    } else {
        setSelectedModules([...selectedModules, module]);
    }
  };

  const toggleAll = () => {
      if (selectedModules.length === SYSTEM_MODULES.length) {
          setSelectedModules([]);
      } else {
          setSelectedModules(SYSTEM_MODULES);
      }
  };

  const startScan = () => {
    setStep(3);
    setScanning(true);
    setLogs([
        `Initializing ${config.testType}...`, 
        `Target: ${config.targetInput}`, 
        `Selected Modules: ${selectedModules.length}`,
        "Loading advanced security engines..."
    ]);
    
    let stepCount = 0;
    const interval = setInterval(() => {
        stepCount++;
        const randomModule = selectedModules[Math.floor(Math.random() * selectedModules.length)] || "Analysis";
        
        if (stepCount === 1) setLogs(prev => [...prev, "Establishing secure connection..."]);
        if (stepCount > 1 && stepCount < 6) {
             setLogs(prev => [...prev, `Running: ${randomModule}...`]);
        }
        if (stepCount === 6) setLogs(prev => [...prev, "Compiling findings..."]);
        if (stepCount === 7) {
            setLogs(prev => [...prev, `Scan Complete. Generating ${config.outputFormat}...`]);
            setScanning(false);
            clearInterval(interval);
        }
    }, 1200);
  };

  const resetSelection = () => {
      setScanMode("selection");
      setStep(1);
      setLogs([]);
      setScanning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 cursor-pointer w-fit" onClick={resetSelection}>
            <h2 className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
                {step === 3 ? "Scan Execution" : "New Security Assessment"}
            </h2>
        </div>
        <p className="text-muted-foreground">
            {step === 1 && "Select your testing method to begin vulnerability analysis."}
            {step === 2 && "Customize the specific security checks to perform."}
            {step === 3 && "Real-time execution logs from the security engine."}
        </p>
      </div>

      {/* Mode Selection View */}
      {scanMode === "selection" && (
         <div className="max-w-2xl mx-auto">
            <div 
                onClick={() => setScanMode("manual")}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg hover:bg-muted/5"
            >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-primary -translate-x-4 group-hover:translate-x-0 transition-transform" />
                </div>
                <div className="mb-6 bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Terminal className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">New Security Assessment</h3>
                <p className="text-muted-foreground mb-4">
                    Configure a new vulnerability scan. Select specific tools, targets, and intensity levels manually.
                </p>
                <span className="text-sm font-medium text-primary flex items-center gap-2">
                    Configure Scan <ArrowRight className="h-4 w-4" />
                </span>
            </div>
         </div>
      )}

      {/* Manual Configuration Step 1 */}
      {scanMode === "manual" && step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="glass-card rounded-xl p-8 space-y-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                    <h3 className="font-bold text-lg text-white">Step 1: Core Configuration</h3>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">1 of 2</span>
                </div>
                
                {/* Test Type */}
                <div className="space-y-2 relative z-10">
                   <label className="text-sm font-medium text-zinc-300">Test Type</label>
                   <select 
                     className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                     value={config.testType}
                     onChange={(e) => setConfig({...config, testType: e.target.value})}
                   >
                       <option>Network Scan</option>
                       <option>Web App Scan</option>
                       <option>Full Security Scan (Net+Web)</option>
                   </select>
                </div>

                {/* Target */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-zinc-300">Target Environment</label>
                       <select 
                         className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                         value={config.targetType}
                         onChange={(e) => setConfig({...config, targetType: e.target.value})}
                       >
                           <option>Localhost Application</option>
                           <option>Docker Test Environment</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-zinc-300">Address / ID</label>
                       <input 
                        type="text" 
                        className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        value={config.targetInput}
                        onChange={(e) => setConfig({...config, targetInput: e.target.value})}
                       />
                    </div>
                </div>

                {/* Intensity & Output */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-zinc-300">Intensity</label>
                       <select 
                         className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                         value={config.intensity}
                         onChange={(e) => setConfig({...config, intensity: e.target.value})}
                       >
                           <option>Passive (Safe/Quick)</option>
                           <option>Standard (Recommended)</option>
                           <option>Deep (Localhost Only)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-zinc-300">Output Format</label>
                       <select 
                         className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                         value={config.outputFormat}
                         onChange={(e) => setConfig({...config, outputFormat: e.target.value})}
                       >
                           <option>Dashboard View</option>
                           <option>Report Format (HTML/JSON/PDF)</option>
                       </select>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 relative z-10">
                    <button onClick={resetSelection} className="btn w-full text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10">Cancel</button>
                    <button 
                        onClick={handleNext} 
                        className="btn btn-primary w-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
                    >
                        Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
             </div>
          </div>
      )}

      {/* Manual Configuration Step 2: Module Selection */}
      {scanMode === "manual" && step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-[600px]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                    <div>
                        <h3 className="font-semibold text-lg">Step 2: Module Selection</h3>
                        <p className="text-sm text-muted-foreground">Select the specific security checks you want to perform.</p>
                    </div>
                    <button 
                        onClick={toggleAll}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        {selectedModules.length === SYSTEM_MODULES.length ? "Deselect All" : "Select All"}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {SYSTEM_MODULES.map((mod, idx) => (
                            <label 
                                key={idx} 
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                    selectedModules.includes(mod) 
                                    ? "bg-primary/5 border-primary" 
                                    : "bg-background border-border hover:border-primary/30"
                                }`}
                            >
                                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center ${
                                    selectedModules.includes(mod) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                }`}>
                                    {selectedModules.includes(mod) && <CheckSquare className="h-3 w-3" />}
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={selectedModules.includes(mod)}
                                        onChange={() => toggleModule(mod)}
                                    />
                                </div>
                                <span className="text-sm font-medium leading-tight">{mod}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center">
                    <button 
                        onClick={() => setStep(1)} 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{selectedModules.length} modules selected</span>
                        <button 
                            onClick={startScan}
                            disabled={selectedModules.length === 0}
                            className="btn btn-primary px-8 flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <Play className="h-4 w-4" /> Start Scan
                        </button>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* Step 3: Console Output */}
      {step === 3 && (
         <div className="h-[600px] rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-300 shadow-inner flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-zinc-500 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-2">
                    <Terminal className="h-3 w-3" /> System Console
                </div>
                {scanning && <span className="text-primary animate-pulse">● Live Execution</span>}
            </div>
            <div className="flex-1 overflow-auto space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-1 duration-200">
                        <span className="text-primary mr-2">➜</span>
                        {log}
                    </div>
                ))}
                {scanning && <span className="animate-pulse text-primary">_</span>}
            </div>
            {!scanning && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                    <button onClick={resetSelection} className="btn btn-secondary text-sm">Return to Dashboard</button>
                </div>
            )}
         </div>
      )}
    </div>
  );
}
