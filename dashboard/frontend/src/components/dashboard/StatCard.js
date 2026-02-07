import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        {Icon && <Icon className="h-24 w-24 text-primary transform translate-x-8 -translate-y-8" />}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${trendUp ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-rose-500/10 text-rose-500'} ring-1 ring-inset ${trendUp ? 'ring-primary/20' : 'ring-rose-500/20'}`}>
                {Icon && <Icon className="h-6 w-6" />}
            </div>
            {trend && (
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? "text-primary bg-primary/5 border border-primary/10" : "text-rose-500 bg-rose-500/5 border border-rose-500/10"}`}>
                    {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {trend}
                </div>
            )}
        </div>
        
        <div>
            <h3 className="text-zinc-500 text-xs font-bold tracking-wider uppercase">{title}</h3>
            <div className="text-3xl font-black text-white mt-1 tracking-tight group-hover:text-neon transition-all">{value}</div>
        </div>
      </div>
      
      {/* Bottom Glow Bar */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${trendUp ? 'bg-primary' : 'bg-red-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_currentColor]`}></div>
    </div>
  );
}
