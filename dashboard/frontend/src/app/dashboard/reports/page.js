"use client";
import { useState } from "react";
import { FileText, Download, Search, Filter, FileCode, FileJson, Eye, Sparkles, X, CheckCircle2, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  const reports = [
    { 
       id: "RPT-2024-001", 
       name: "Executive Security Summary - Q1", 
       scan: "Full Infrastructure Audit",
       date: "Feb 5, 2024", 
       type: "PDF",
       size: "2.4 MB",
       status: "Ready"
    },
    { 
       id: "RPT-2024-002", 
       name: "Vulnerability Technical Detail", 
       scan: "SC-1023 (Web App)",
       date: "Feb 5, 2024", 
       type: "HTML",
       size: "856 KB",
       status: "Ready"
    },
    { 
       id: "RPT-2024-003", 
       name: "Raw Scan Data Export", 
       scan: "SC-1023 (Web App)",
       date: "Feb 5, 2024", 
       type: "JSON",
       size: "124 KB",
       status: "Ready"
    },
    { 
       id: "RPT-2024-004", 
       name: "Compliance Audit (ISO 27001)", 
       scan: "SC-1021 (Prod DB)",
       date: "Jan 28, 2024", 
       type: "PDF",
       size: "4.1 MB",
       status: "Archived"
    }
  ];

  const handleGenerateSummary = () => {
      if (!selectedReport) return;
      setGenerating(true);
      
      // Mock AI generation
      setTimeout(() => {
          setGenerating(false);
          setSummary({
              title: selectedReport.name,
              content: "The scan identified 3 critical vulnerabilities in the target infrastructure, primarily related to outdated SSL options and a potential SQL injection vector in the login module. Remediation is recommended within 24 hours.",
              score: "Risk Level: High"
          });
      }, 2000);
  };

  const closeSummary = () => {
      setSummary(null);
      setSelectedReport(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Security Reports</h2>
           <p className="text-muted-foreground">Access and download generated scan documentation.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <button 
                onClick={handleGenerateSummary}
                disabled={!selectedReport}
                className={`btn h-10 px-4 flex items-center gap-2 transition-all ${
                    selectedReport 
                    ? "btn-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]" 
                    : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                }`}
             >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} 
                {generating ? "Analyzing..." : "AI Summary"}
             </button>
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="w-full pl-9 h-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
             </div>
             <button className="btn btn-outline h-10 w-10 p-0 flex items-center justify-center shrink-0">
                <Filter className="h-4 w-4" />
             </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4 w-10">
                    <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Source Scan</th>
                <th className="px-6 py-4">Date Generated</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr 
                    key={report.id} 
                    className={`transition-colors group cursor-pointer ${selectedReport?.id === report.id ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/5"}`}
                    onClick={() => setSelectedReport(report)}
                >
                  <td className="px-6 py-4">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedReport?.id === report.id ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                          {selectedReport?.id === report.id && <CheckCircle2 className="h-3 w-3 text-black" />}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                            report.type === "PDF" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                            report.type === "HTML" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                            "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        }`}>
                            {report.type === "PDF" ? <FileText className="h-5 w-5" /> :
                             report.type === "HTML" ? <FileCode className="h-5 w-5" /> :
                             <FileJson className="h-5 w-5" />}
                        </div>
                        <div>
                            <div className="font-medium text-foreground">{report.name}</div>
                            <div className="text-xs text-muted-foreground">{report.size} • {report.status}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{report.scan}</td>
                  <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        report.type === "PDF" ? "bg-rose-500/5 text-rose-500 border-rose-500/20" :
                        report.type === "HTML" ? "bg-orange-500/5 text-orange-500 border-orange-500/20" :
                        "bg-blue-500/5 text-blue-500 border-blue-500/20"
                     }`}>
                        {report.type}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-primary hover:text-primary-foreground transition-colors text-primary border border-primary/20 bg-primary/5">
                            <Download className="h-4 w-4" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Summary Modal */}
      {summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 px-4">
            <div className="bg-black/90 border border-primary/30 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(34,197,94,0.2)] relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">AI Security Insight</h3>
                            <p className="text-xs text-primary/70">Analysis for: {summary.title}</p>
                        </div>
                    </div>
                    <button onClick={closeSummary} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {summary.content}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                         <span className="text-xs font-medium text-rose-400">Critical Attention Needed</span>
                         <span className="text-xs font-bold text-rose-500">{summary.score}</span>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={closeSummary} className="flex-1 btn btn-secondary text-xs">Close</button>
                        <button className="flex-1 btn btn-primary text-xs shadow-lg shadow-primary/20">View Full Details</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
