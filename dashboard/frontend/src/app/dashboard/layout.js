import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <Sidebar />
      <div className="relative z-10 md:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
