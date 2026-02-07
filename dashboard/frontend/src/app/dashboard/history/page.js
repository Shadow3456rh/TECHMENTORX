"use client";
import { useState, useEffect } from "react";
import { FileText, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Sparkles, Download, Loader2, X } from "lucide-react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { jsPDF } from "jspdf";

export default function HistoryPage() {
   const [scans, setScans] = useState([]);
   const [loading, setLoading] = useState(true);
   const [summary, setSummary] = useState(null);
   const [selectedScan, setSelectedScan] = useState(null);
   const [summarizingId, setSummarizingId] = useState(null);

   useEffect(() => {
      const q = query(collection(db, "history"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
         const fetchedScans = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
               id: doc.id,
               target: data.target,
               date: data.date ? new Date(data.date.seconds * 1000).toLocaleString() : "Pending...",
               duration: data.duration,
               type: data.type,
               status: data.status,
               findings: {
                  critical: data.findings?.vulns || 0,
                  medium: data.findings?.warnings || 0,
                  low: data.findings?.info || 0
               },
               full_log: data.full_log || ""
            };
         });
         setScans(fetchedScans);
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const generateAiSummary = async (scan) => {
      if (!scan.full_log) {
         alert("No log data available for this scan.");
         return;
      }
      setSummarizingId(scan.id);
      setSelectedScan(scan);

      try {
         const response = await fetch('http://localhost:5001/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ report: scan.full_log })
         });

         if (!response.ok) throw new Error("Backend summarization failed");

         const data = await response.json();
         setSummary({
            title: `AI Analysis: ${scan.target}`,
            content: data.summary,
            score: "AI Generated"
         });
      } catch (error) {
         console.error("Summary failed:", error);
         alert("Failed to generate summary. Ensure local LLM backend is running.");
      } finally {
         setSummarizingId(null);
      }
   };

   const exportScanLog = (scan) => {
      const element = document.createElement("a");
      const file = new Blob([scan.full_log], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `scan_log_${scan.target}_${scan.id}.txt`;
      document.body.appendChild(element);
      element.click();
   };

   const exportFullHistory = () => {
      const headers = ["ID,Target,Date,Type,Status,Duration,Critical,Medium,Low\n"];
      const rows = scans.map(s =>
         `${s.id},${s.target},"${s.date.replace(/,/g, '')}",${s.type},${s.status},${s.duration},${s.findings.critical},${s.findings.medium},${s.findings.low}`
      );

      const blob = new Blob([...headers, ...rows.join("\n")], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan_history_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
   };

   if (loading) return <div className="p-10 text-center text-zinc-500">Loading history...</div>;

   return (
      <div className="space-y-6 animate-in fade-in duration-500 relative">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
               <h2 className="text-2xl font-bold tracking-tight">Scan History</h2>
               <p className="text-muted-foreground">Archive of all performed security assessments.</p>
            </div>
            <button onClick={exportFullHistory} className="btn btn-outline flex items-center gap-2 h-9 px-3 text-sm">
               <Download className="h-4 w-4" /> Export CSV
            </button>
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
                     {scans.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                              No scan history found. Run a scan to populate this list.
                           </td>
                        </tr>
                     ) : (
                        scans.map((scan) => (
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
                                       {scan.findings.critical === 0 && scan.findings.medium === 0 && scan.findings.low === 0 && (
                                          <span className="text-zinc-500 text-xs">Safe</span>
                                       )}
                                    </div>
                                 )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button
                                       onClick={() => generateAiSummary(scan)}
                                       disabled={summarizingId === scan.id || !scan.full_log}
                                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-primary/10 text-zinc-400 hover:text-primary transition-colors text-xs font-medium border border-transparent hover:border-primary/20"
                                    >
                                       {summarizingId === scan.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                       {summarizingId === scan.id ? "Analyzing..." : "AI Insight"}
                                    </button>
                                    <button
                                       onClick={() => exportScanLog(scan)}
                                       disabled={!scan.full_log}
                                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-medium border border-transparent hover:border-white/10"
                                    >
                                       <Download className="h-3 w-3" /> Log
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        )))}
                  </tbody>
               </table>
            </div>
         </div>


         {/* AI Summary Modal */}
         {
            summary && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 px-4">
                  <div className="bg-black/90 border border-primary/30 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(34,197,94,0.2)] relative overflow-hidden">
                     <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

                     <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                              <Sparkles className="h-5 w-5" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">Session Analysis</h3>
                              <p className="text-xs text-primary/70">{summary.title}</p>
                           </div>
                        </div>
                        <button onClick={() => setSummary(null)} className="text-zinc-500 hover:text-white transition-colors">
                           <X className="h-5 w-5" />
                        </button>
                     </div>

                     <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar relative z-10 space-y-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
                           <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                              {summary.content}
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-3 pt-6 relative z-10">
                        <button onClick={() => setSummary(null)} className="flex-1 btn btn-secondary text-xs">Close</button>
                     </div>
                  </div>
               </div>
            )
         }
      </div >
   );
}
