import Link from "next/link";
import { MoreHorizontal, Play, FileText } from "lucide-react";

const mockScans = [
  { id: "SC-1023", target: "192.168.1.105", type: "Full Scan", status: "Completed", high: 2, med: 5, low: 12, date: "2 mins ago" },
  { id: "SC-1022", target: "staging.api.com", type: "Quick Scan", status: "Running", high: 0, med: 0, low: 0, date: "15 mins ago" },
  { id: "SC-1021", target: "prod-db-01", type: "Deep Scan", status: "Completed", high: 0, med: 1, low: 6, date: "1 hour ago" },
  { id: "SC-1020", target: "10.0.0.55", type: "Network", status: "Failed", high: 0, med: 0, low: 0, date: "3 hours ago" },
  { id: "SC-1019", target: "auth-service", type: "Web", status: "Completed", high: 5, med: 8, low: 2, date: "Yesterday" },
];

export default function ScanTable() {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/5">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
        <h3 className="font-semibold text-lg tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Recent Scans
        </h3>
        <button className="text-xs font-medium text-primary hover:text-primary/80 uppercase tracking-wider border border-primary/20 hover:bg-primary/10 px-3 py-1 rounded transition-all">
            View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-zinc-500 font-bold uppercase text-xs tracking-wider border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Scan ID</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Vulnerabilities</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockScans.map((scan) => (
              <tr 
                key={scan.id} 
                className="hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-medium text-primary group-hover:text-glow transition-all">
                    <Link href="/dashboard/results" className="hover:underline">
                        {scan.id}
                    </Link>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{scan.target}</td>
                <td className="px-6 py-4">{scan.type}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={scan.status} />
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        {scan.status === "Completed" ? (
                            <>
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold">{scan.high} H</span>
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">{scan.med} M</span>
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold">{scan.low} L</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground opacity-50">-</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{scan.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
    const styles = {
        Completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        Running: "bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        Failed: "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${styles[status] || "bg-zinc-800 text-zinc-400"}`}>
            {status}
        </span>
    );
}
