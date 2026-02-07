"use client";
import StatCard from "@/components/dashboard/StatCard";
import ScanTable from "@/components/dashboard/ScanTable";
import { Activity, ShieldAlert, Target, Search, Server, Zap, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
           <p className="text-muted-foreground mt-1">
              Welcome back, <span className="font-medium text-foreground">Aryan</span>. Here's your security posture today.
           </p>
        </div>
        <div className="flex gap-3">
             <button className="h-10 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors">
                Download Report
             </button>
             <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                <Zap className="h-4 w-4" /> New Scan
             </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Scans" 
            value="1,248" 
            icon={Search} 
            trend="+12%" 
            trendUp={true} 
        />
        <StatCard 
            title="Critical Issues" 
            value="7" 
            icon={ShieldAlert} 
            trend="-2" 
            trendUp={true} 
        />
        <StatCard 
            title="Active Targets" 
            value="42" 
            icon={Target} 
            trend="+4%" 
            trendUp={true} 
        />
        <StatCard 
            title="Security Score" 
            value="84" 
            icon={Activity} 
            trend="+2%" 
            trendUp={true} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Recent Scans & Trend Chart */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Chart Placeholder (CSS) */}
            <div className="glass-card rounded-xl p-6 relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Vulnerability Trend
                        </h3>
                        <p className="text-sm text-muted-foreground">Detected issues over the last 30 days.</p>
                    </div>
                    <select className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground focus:outline-none focus:border-primary">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                
                {/* CSS Bar Chart */}
                <div className="h-64 flex items-end gap-2 md:gap-4 px-2">
                    {[35, 45, 30, 60, 75, 50, 65, 40, 55, 70, 45, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full relative flex items-end h-full rounded-t-sm overflow-hidden bg-white/5 group-hover:bg-white/10 transition-colors">
                                <div 
                                    style={{ height: `${h}%` }} 
                                    className={`w-full ${i === 11 ? "bg-primary shadow-[0_0_15px_rgba(31,222,109,0.5)]" : "bg-primary/40"} transition-all duration-500 relative group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(31,222,109,0.5)]`}
                                ></div>
                            </div>
                            <span className="text-[10px] text-muted-foreground hidden md:block">Day {i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <ScanTable />
         </div>

         {/* Right Column: Sidebar Widgets */}
         <div className="space-y-6">
            
            {/* System Health */}
            <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h3 className="font-semibold text-sm tracking-wide">SYSTEM STATUS</h3>
                </div>
                <div className="p-4 space-y-4">
                    <HealthItem label="API Gateway" status="Operational" color="bg-emerald-500" ping />
                    <HealthItem label="Scan Engine V2" status="Processing" color="bg-blue-500" ping />
                    <HealthItem label="Database Shard 1" status="Operational" color="bg-emerald-500" />
                    <HealthItem label="AI Threat Model" status="Updating..." color="bg-amber-500" />
                </div>
            </div>
            
            {/* Active Nodes Card */}
            <div className="glass-card rounded-xl border border-primary/20 bg-gradient-to-br from-black to-zinc-900 text-white p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Server className="h-24 w-24 transform translate-x-4 -translate-y-4 text-primary" />
               </div>
               <div className="relative z-10">
                   <h3 className="font-semibold mb-1 flex items-center gap-2 text-zinc-300">
                      <Activity className="h-4 w-4 text-primary animate-pulse" /> Active Scanners
                   </h3>
                   <div className="text-4xl font-bold mb-2 tracking-tight text-glow">12/16</div>
                   <p className="text-xs text-zinc-500">
                      4 nodes idle, ready for new tasks.
                   </p>
                   
                   <div className="mt-6 flex gap-1">
                       {[...Array(12)].map((_, i) => (
                           <div key={i} className="h-1.5 flex-1 rounded-full bg-primary shadow-[0_0_5px_currentColor]"></div>
                       ))}
                       {[...Array(4)].map((_, i) => (
                           <div key={i} className="h-1.5 flex-1 rounded-full bg-zinc-800"></div>
                       ))}
                   </div>
               </div>
            </div>

            {/* Quick Actions */}
             <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-xs font-medium text-center transition-all duration-300">
                        Add Target
                    </button>
                    <button className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-xs font-medium text-center transition-all duration-300">
                        View Logs
                    </button>
                    <button className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-xs font-medium text-center transition-all duration-300">
                        Manage Team
                    </button>
                    <button className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-xs font-medium text-center transition-all duration-300">
                        API Keys
                    </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function HealthItem({ label, status, color, ping }) {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
            <div className="flex items-center gap-2.5">
                <div className="relative flex h-2.5 w-2.5">
                  {ping && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}></span>
                </div>
                <span className="text-xs font-medium">{status}</span>
            </div>
        </div>
    );
}
