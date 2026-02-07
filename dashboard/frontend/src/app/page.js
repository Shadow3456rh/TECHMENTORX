import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, Lock, FileText, ChevronRight, Zap, CheckCircle, Activity, Server, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

          <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              v2.0 Beta is live
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
              Next-Gen AI Security <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Vulnerability Scanning
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Detect, analyze, and remediate security threats with our AI-powered platform.
              Seamlessly integrate Nmap and Nikto scans with intelligent insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                Start Scanning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Features
              </Link>
            </div>

            {/* Interface Preview - CSS Mockup */}
            <div className="mt-20 mx-auto max-w-5xl rounded-xl border border-border bg-card/50 shadow-2xl overflow-hidden backdrop-blur-sm animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="aspect-[16/9] bg-zinc-900 flex items-center justify-center relative group p-1 md:p-4">

                {/* Dashboard Mockup Container */}
                <div className="relative z-10 w-full h-full bg-background rounded-lg shadow-2xl border border-border flex overflow-hidden">

                  {/* Sidebar Mockup */}
                  <div className="w-16 md:w-64 border-r border-border bg-secondary/20 flex flex-col p-4 gap-4 hidden md:flex">
                    <div className="h-8 w-8 rounded bg-primary/20 mb-4"></div>
                    <div className="h-4 w-3/4 rounded bg-secondary"></div>
                    <div className="h-4 w-1/2 rounded bg-secondary/50"></div>
                    <div className="h-4 w-2/3 rounded bg-secondary/50"></div>
                    <div className="mt-auto h-12 rounded bg-secondary/30"></div>
                  </div>

                  {/* Main Content Mockup */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background">
                      <div className="h-4 w-32 rounded bg-secondary"></div>
                      <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                    </div>

                    {/* Dashboard Widgets */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                      {/* Stats Cards */}
                      <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-3 w-20 rounded bg-secondary"></div>
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="h-8 w-16 rounded bg-primary/20 mb-1"></div>
                        <div className="h-2 w-full rounded bg-secondary/30 mt-2">
                          <div className="h-full w-3/4 bg-primary rounded"></div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-3 w-20 rounded bg-secondary"></div>
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="h-8 w-16 rounded bg-rose-500/20 mb-1"></div>
                        <div className="h-2 w-full rounded bg-secondary/30 mt-2">
                          <div className="h-full w-1/4 bg-rose-500 rounded"></div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-3 w-20 rounded bg-secondary"></div>
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="h-8 w-16 rounded bg-emerald-500/20 mb-1"></div>
                        <div className="h-2 w-full rounded bg-secondary/30 mt-2">
                          <div className="h-full w-full bg-emerald-500 rounded"></div>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="col-span-1 md:col-span-2 p-4 rounded-lg border border-border bg-card shadow-sm flex flex-col justify-end h-64 relative">
                        <div className="absolute top-4 left-4 h-4 w-32 rounded bg-secondary"></div>
                        <div className="flex items-end gap-4 h-40 px-2">
                          <div className="w-full bg-primary/30 rounded-t h-[40%]"></div>
                          <div className="w-full bg-primary/50 rounded-t h-[70%]"></div>
                          <div className="w-full bg-primary rounded-t h-[50%]"></div>
                          <div className="w-full bg-primary/80 rounded-t h-[85%]"></div>
                          <div className="w-full bg-primary/40 rounded-t h-[60%]"></div>
                        </div>
                      </div>

                      {/* Activity Feed */}
                      <div className="col-span-1 p-4 rounded-lg border border-border bg-card shadow-sm space-y-3">
                        <div className="h-4 w-24 rounded bg-secondary mb-2"></div>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex gap-3 items-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <div className="h-2 w-full rounded bg-secondary/50"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Real-time dashboard interface preview
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Powerful Security Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Automated tools designed for modern DevSecOps workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Activity className="h-6 w-6 text-blue-500" />}
                title="Instant Scanning"
                description="Launch Nmap and Nikto scans instantly. Get real-time status updates and progress tracking directly from the dashboard."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-emerald-500" />}
                title="AI Remediation"
                description="Our AI analyzes vulnerabilities and suggests precise remediation steps to fix issues faster than human analysts."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-amber-500" />}
                title="Automated Reports"
                description="Export comprehensive security reports in PDF/HTML formats for your compliance needs with a single click."
              />
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 tracking-tight">Enterprise-grade security without the complexity</h2>
                <ul className="space-y-4">
                  <ListItem title="Continuous Monitoring" desc="Set up scheduled scans to monitor your infrastructure 24/7." />
                  <ListItem title="Role-Based Access" desc="Granular permissions for your security team members." />
                  <ListItem title="API Integration" desc="Full REST API access to integrate with your CI/CD pipelines." />
                </ul>
              </div>
              <div className="h-[400px] rounded-2xl bg-gradient-to-br from-secondary to-background border border-border p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-grid-slate-800/20"></div>
                <Server className="absolute bottom-[-10%] right-[-10%] w-64 h-64 text-primary/5 opacity-50 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your infrastructure?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and security professionals using PentestIQ today.
            </p>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-transform active:scale-95"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span>PentestIQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 PentestIQ Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 group">
      <div className="mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function ListItem({ title, desc }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1 bg-primary/10 p-1 rounded-full h-8 w-8 flex items-center justify-center text-primary shrink-0">
        <CheckCircle className="h-4 w-4" />
      </div>
      <div>
        <h4 className="font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
