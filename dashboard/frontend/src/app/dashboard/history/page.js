"use client";
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function HistoryPage() {
  const historyScans = [
    { 
       id: "SC-1025", 
       target: "dev-api.internal", 
       date: "Today, 10:42 AM", 
       duration: "8m 12s",
       type: "API Security Scan", 
       status: "Completed", 
       findings: { critical: 1, medium: 2, low: 5 } 
    },
    { 
       id: "SC-1024", 
       target: "192.168.1.50 (Redis)", 
       date: "Yesterday, 4:15 PM", 
       duration: "3m 45s",
       type: "Network Discovery", 
       status: "Failed", 
       findings: { critical: 0, medium: 0, low: 0 } 
    },
    { 
       id: "SC-1023", 
       target: "frontend-v2-deployment", 
       date: "Feb 5, 2024", 
       duration: "15m 30s",
       type: "Full Web Scan", 
       status: "Completed", 
       findings: { critical: 0, medium: 4, low: 12 } 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Scan History</h2>
        <p className="text-muted-foreground">Archive of all performed security assessments.</p>
      </div>

      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-zinc-500 font-bold uppercase text-xs tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Scan Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Findings Summary</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-white/5 transition-colors group cursor-default">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white group-hover:text-primary transition-colors">{scan.target}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1 font-mono">
                        <Calendar className="h-3 w-3" /> {scan.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-zinc-300 border border-white/10 text-xs font-medium">
                        <FileText className="h-3 w-3" /> {scan.type}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     {scan.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                           <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                           <XCircle className="h-3 w-3" /> Failed
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                     <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {scan.duration}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     {scan.status === "Completed" && (
                        <div className="flex gap-2">
                           {scan.findings.critical > 0 && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                                 {scan.findings.critical} Crit
                              </span>
                           )}
                           {scan.findings.medium > 0 && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                                 {scan.findings.medium} Med
                              </span>
                           )}
                           {scan.findings.low > 0 && (
                              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
                                 {scan.findings.low} Low
                              </span>
                           )}
                        </div>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-primary hover:text-white text-xs font-medium transition-colors border-b border-primary/30 hover:border-white">View Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
