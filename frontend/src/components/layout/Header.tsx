"use client";

import Link from "next/link";
import { PlusCircle, Sparkles, AlertCircle } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  projectId?: string;
  badge?: string;
}

export default function Header({ title, subtitle, projectId, badge }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">
              {title || "LaunchWise AI Intelligence"}
            </h1>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/70 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Engine Status: Active</span>
        </div>

        <Link
          href="/new-analysis"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </Link>
      </div>
    </header>
  );
}
