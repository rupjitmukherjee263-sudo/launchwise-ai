"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  FileText,
  SlidersHorizontal,
  Users,
  MessageSquareCode,
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({ projectId }: { projectId?: string }) {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Analysis", href: "/new-analysis", icon: PlusCircle },
    { name: "Project Archive", href: "/history", icon: History },
    { name: "Settings & APIs", href: "/settings", icon: Settings },
  ];

  const projectNav = projectId
    ? [
        { name: "Pipeline Workspace", href: `/analysis/${projectId}`, icon: Compass },
        { name: "Feasibility Report", href: `/analysis/${projectId}/report`, icon: FileText },
        { name: "Financial Simulator", href: `/analysis/${projectId}/simulator`, icon: SlidersHorizontal },
        { name: "Competitor Explorer", href: `/analysis/${projectId}/competitors`, icon: Users },
        { name: "AI Consultant Chat", href: `/analysis/${projectId}/assistant`, icon: MessageSquareCode },
      ]
    : [];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
            LaunchWise <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">AI</span>
          </span>
          <p className="text-[11px] text-slate-400">Product Launch Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
        {/* Core Sections */}
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Project Specific Sections */}
        {projectId && (
          <div>
            <div className="px-3 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
              <span>Active Project</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <nav className="space-y-1">
              {projectNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-800 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Verified Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="rounded-lg p-3 bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-medium text-slate-200">Evidence Guard Engine</p>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
              Deterministic financial calculations. Grounded competitor research.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
