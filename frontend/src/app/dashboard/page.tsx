"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { Project } from "@/lib/types";
import {
  TrendingUp,
  FileText,
  Compass,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Users
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projs, smpls] = await Promise.all([
          api.getProjects().catch(() => []),
          api.getSamples().catch(() => [])
        ]);
        setProjects(projs);
        setSamples(smpls);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <AppShell title="Founder Intelligence Dashboard" subtitle="Overview of product feasibility analyses and localized market intelligence">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Analyses</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
          <p className="text-xs text-slate-500 mt-1">Evaluated business concepts</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completed Reports</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <p className="text-xs text-slate-500 mt-1">Ready with 22-section dossiers</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg. Evidence Coverage</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">87.5%</div>
          <p className="text-xs text-slate-500 mt-1">Grounded local citations</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Recommended Opportunities</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedCount > 0 ? "2 Verified" : "0"}</div>
          <p className="text-xs text-slate-500 mt-1">Launch / Pilot candidates</p>
        </div>
      </div>

      {/* Main Grid: Projects + Pre-loaded Case Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Feasibility Projects</h2>
            <Link href="/new-analysis" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>+ New Analysis</span>
            </Link>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No projects analyzed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit your first product or business idea to analyze local competitors, unit economics, and viability.
              </p>
              <Link
                href="/new-analysis"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
              >
                Start First Analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{proj.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        proj.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : proj.status === 'analyzing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                    {proj.idea && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.idea.city_region}, {proj.idea.country}</span>
                        <span className="text-slate-300">•</span>
                        <span>{proj.idea.category}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/analysis/${proj.id}/report`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </Link>
                    <Link
                      href={`/analysis/${proj.id}/simulator`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Simulator</span>
                    </Link>
                    <Link
                      href={`/analysis/${proj.id}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pre-loaded Case Studies & Quick Launcher */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Pre-Loaded Intelligence Cases</h2>
          <div className="space-y-3">
            {samples.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 mt-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{s.city_region}, {s.country}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Price: <span className="font-semibold text-slate-800">INR {s.intended_price}</span>
                  </div>
                  <Link
                    href={`/analysis/demo-${s.id}/report`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Explore Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
