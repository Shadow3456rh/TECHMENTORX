"use client";
import { Download, ChevronDown, ShieldAlert, CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function ResultsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header / Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">Scan Results: SC-1023</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">Completed</span>
           </div>
           <p className="text-muted-foreground">Target: 192.168.1.105 • Duration: 14m 32s • Completed: 2 mins ago</p>
        </div>
        <div className="flex gap-2">
           <button className="btn btn-outline gap-2 bg-background hover:bg-accent text-sm h-10 px-4 border border-input rounded-md flex items-center transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
           </button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <ResultCard label="Security Score" value="C+" color="text-amber-500" sub="Needs Attention" />
         <ResultCard label="Critical Issues" value="2" color="text-rose-500" sub="Immediate Action Required" />
         <ResultCard label="Medium Risks" value="5" color="text-amber-500" sub="Review Recommended" />
         <ResultCard label="Open Ports" value="4" color="text-blue-500" sub="22, 80, 443, 8080" />
      </div>

      {/* Vulnerability Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-semibold text-lg">Detected Vulnerabilities</h3>
            
            {/* Critical Vuln */}
            <VulnCard 
               severity="Critical" 
               title="SQL Injection (Blind)" 
               description="The application appears to be vulnerable to SQL injection via the 'id' parameter."
               cve="CVE-2023-4512" 
               tool="Nikto"
            />
             {/* Critical Vuln 2 */}
            <VulnCard 
               severity="Critical" 
               title="Outdated Apache Version" 
               description="Apache 2.4.49 is running, which is vulnerable to Path Traversal."
               cve="CVE-2021-41773" 
               tool="Nmap"
            />
            {/* Medium Vuln */}
             <VulnCard 
               severity="Medium" 
               title="Missing Security Headers" 
               description="X-Frame-Options and Content-Security-Policy headers are missing."
               cve="N/A" 
               tool="Nikto"
            />
         </div>

         {/* Remediation / AI Insights */}
         <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
               <span className="bg-primary/10 p-1 rounded">AI</span>
               Remediation Plan
            </h3>
            
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
               <div>
                  <h4 className="font-medium mb-2 text-sm">1. Patch Apache Server</h4>
                  <p className="text-xs text-muted-foreground mb-2">Upgrade to version 2.4.51 or later immediately to mitigate CVE-2021-41773.</p>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 font-mono text-xs text-zinc-300">
                     apt-get update && apt-get upgrade apache2
                  </div>
               </div>
               
               <div className="h-px bg-border"></div>

               <div>
                   <h4 className="font-medium mb-2 text-sm">2. Fix SQL Injection</h4>
                  <p className="text-xs text-muted-foreground mb-2">Use parameterized queries (Prepared Statements) in the login module.</p>
               </div>
            </div>

            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
               <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Impact Analysis</h4>
               <p className="text-xs text-muted-foreground">
                  If exploited, these vulnerabilities could lead to full database compromise and remote code execution.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, color, sub }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
    );
}

function VulnCard({ severity, title, description, cve, tool }) {
   const colors = {
      Critical: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
   };

   return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
         <div className="p-4 flex gap-4">
            <div className={`w-1 shrink-0 rounded-full ${severity === "Critical" ? "bg-rose-500" : severity === "Medium" ? "bg-amber-500" : "bg-blue-500"}`}></div>
            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-foreground">{title}</h4>
                   <span className={`text-xs font-medium px-2 py-0.5 rounded border ${colors[severity]}`}>{severity}</span>
               </div>
               <p className="text-sm text-muted-foreground mb-3">{description}</p>
               <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                     <AlertTriangle className="h-3 w-3" /> {cve}
                  </span>
                  <span className="flex items-center gap-1">
                     <Info className="h-3 w-3" /> {tool}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
}
