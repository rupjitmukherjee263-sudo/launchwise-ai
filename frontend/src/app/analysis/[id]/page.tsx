"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { AnalysisStatus, Project } from "@/lib/types";
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  SlidersHorizontal,
  Users,
  MessageSquareCode,
  ShieldAlert,
  Loader2,
  Sparkles
} from "lucide-react";

export default function AnalysisWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any;

    async function checkStatus() {
      try {
        const [projData, statusData] = await Promise.all([
          api.getProject(projectId).catch(() => null),
          api.getAnalysisStatus(projectId).catch(() => null),
        ]);

        if (projData) setProject(projData);
        if (statusData) {
          setStatus(statusData);
          if (statusData.status === "completed" || statusData.status === "failed") {
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
    interval = setInterval(checkStatus, 1500);

    return () => clearInterval(interval);
  }, [projectId]);

  const stages = [
    { key: "Stage A", name: "Idea Understanding", desc: "Extract problem, target demographic, and revenue model" },
    { key: "Stage B", name: "Market Research", desc: "Benchmark TAM, SAM, SOM and industry growth indicators" },
    { key: "Stage C", name: "Competitor Discovery", desc: "Scan localized catchment for direct and indirect offerings" },
    { key: "Stage D", name: "Customer Analysis", desc: "Formulate evidence-based personas and purchasing motivators" },
    { key: "Stage E", name: "Pricing Strategy", desc: "Derive budget, standard, and premium pricing tiers" },
    { key: "Stage F", name: "Financial Modeling", desc: "Run deterministic 12-month projections and break-even math" },
    { key: "Stage G & H", name: "Risks & GTM Roadmap", desc: "Synthesize 30-60-90 day pilot and risk mitigations" },
    { key: "Stage I", name: "Synthesis Complete", desc: "Final feasibility verdict and confidence rating" },
  ];

  const currentPct = status?.progress_percentage || 0;
  const isDone = status?.status === "completed";

  return (
    <AppShell
      projectId={projectId}
      title={project ? project.name : "Research Workspace"}
      subtitle={project?.idea ? `${project.idea.category} • ${project.idea.city_region}` : "Autonomous Research Pipeline"}
      badge={isDone ? "Report Ready" : "Pipeline Active"}
    >
      <div className="space-y-8">
        {/* Progress Overview Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Multi-Stage Agent Status
              </span>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {isDone ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Feasibility Assessment Ready</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span>{status?.current_stage || "Processing Idea..."}</span>
                  </>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-slate-900">{currentPct}%</span>
              {isDone && (
                <Link
                  href={`/analysis/${projectId}/report`}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View 22-Section Report</span>
                </Link>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isDone ? "bg-emerald-500" : "bg-blue-600"
              }`}
              style={{ width: `${currentPct}%` }}
            />
          </div>

          {/* Quick-Action Tiles (Shown when complete) */}
          {isDone && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Link
                href={`/analysis/${projectId}/report`}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Feasibility Report</p>
                  <p className="text-[11px] text-slate-500">22 comprehensive sections</p>
                </div>
              </Link>

              <Link
                href={`/analysis/${projectId}/simulator`}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Financial Simulator</p>
                  <p className="text-[11px] text-slate-500">Recalculate assumptions</p>
                </div>
              </Link>

              <Link
                href={`/analysis/${projectId}/competitors`}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Competitor Matrix</p>
                  <p className="text-[11px] text-slate-500">Map & local intelligence</p>
                </div>
              </Link>

              <Link
                href={`/analysis/${projectId}/assistant`}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <MessageSquareCode className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">AI Consultant</p>
                  <p className="text-[11px] text-slate-500">Interactive Q&A engine</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* 2-Column Details: Stages Breakdown + Live Execution Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Pipeline Stages List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Pipeline Stages & Verification</h3>
            <div className="space-y-3">
              {stages.map((st, idx) => {
                const stagePct = (idx + 1) * 12.5;
                const isPassed = currentPct >= stagePct || isDone;
                return (
                  <div
                    key={st.key}
                    className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 ${
                      isPassed
                        ? "bg-slate-50/80 border-slate-200 text-slate-900"
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">
                        <span className="text-blue-600 mr-1.5">{st.key}:</span>
                        {st.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Execution Logs */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Deterministic Execution Stream</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">live telemetry</span>
            </div>

            <div className="flex-1 space-y-3 font-mono text-xs overflow-y-auto max-h-[460px] pr-2">
              {status?.logs && status.logs.length > 0 ? (
                status.logs.map((log, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="text-blue-400 font-semibold">{log.stage}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{log.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-600 text-xs">
                  Awaiting pipeline activity...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
