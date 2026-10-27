"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { FeasibilityReport, Project } from "@/lib/types";
import { formatINR, formatPercent, formatNumber } from "@/lib/utils";
import {
  Download,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  DollarSign,
  Target,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function FeasibilityReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "market" | "finance" | "roadmap">("summary");

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, repData] = await Promise.all([
          api.getProject(projectId).catch(() => null),
          api.getFeasibilityReport(projectId).catch(() => null),
        ]);
        if (projData) setProject(projData);
        if (repData) setReport(repData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <AppShell projectId={projectId} title="Feasibility Intelligence Report">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
          Loading comprehensive feasibility dossier...
        </div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell projectId={projectId} title="Feasibility Report Not Ready">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-base font-semibold text-slate-800">Report In Progress or Missing</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The multi-stage analysis pipeline has not yet compiled the final feasibility report for this idea.
          </p>
          <Link
            href={`/analysis/${projectId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <span>Go to Pipeline Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AppShell>
    );
  }

  const sections = report.sections_data || {};
  const rec = report.recommendation;
  const isLaunch = rec.includes("LAUNCH");

  return (
    <AppShell
      projectId={projectId}
      title={project?.name || "Business Feasibility Report"}
      subtitle="22-Section Evidence-Based Launch Intelligence & Financial Audit"
      badge={rec}
    >
      <div className="space-y-6">
        {/* Top Header Card with Download Buttons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Official Feasibility Assessment
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">
                Generated {new Date(report.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {project?.idea?.title || project?.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={api.getPdfExportUrl(projectId)}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </a>

            <a
              href={api.getFinancialCsvUrl(projectId)}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Financials CSV</span>
            </a>

            <a
              href={api.getCompetitorsCsvUrl(projectId)}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Competitors CSV</span>
            </a>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === "summary"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Executive Summary & Verdict
          </button>
          <button
            onClick={() => setActiveTab("market")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === "market"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Market & Competitor Analysis
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === "finance"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Financial Feasibility & Break-Even
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === "roadmap"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Risks & 90-Day GTM Roadmap
          </button>
        </div>

        {/* TAB 1: EXECUTIVE VERDICT */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* Feasibility Verdict Card */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${
              isLaunch ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-200/60">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Final Recommendation
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-2xl font-black ${isLaunch ? "text-emerald-700" : "text-amber-700"}`}>
                      {rec}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Viability Score</span>
                    <p className="text-2xl font-black text-slate-900">{report.viability_score}/100</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Evidence Confidence</span>
                    <p className="text-2xl font-black text-blue-600">{report.confidence_score}%</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Audit Rationale:</p>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {report.confidence_rationale}
                </p>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>1. Executive Summary</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {report.executive_summary}
              </p>
            </div>

            {/* 2. Product Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>2. Product Idea & Strategic Scope</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {sections["2_product_overview"]}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: MARKET & COMPETITION */}
        {activeTab === "market" && (
          <div className="space-y-6">
            {/* 4 & 5. Market Sizing TAM / SAM / SOM */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>4 & 5. Market Demand & Bottom-Up Sizing</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sections["4_market_demand_trends"]}
              </p>

              {sections["5_market_sizing"] && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TAM (National Category)</span>
                    <p className="text-base font-bold text-slate-900 mt-1">{sections["5_market_sizing"].tam}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Total macro category scale</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">SAM (Metro Catchment)</span>
                    <p className="text-base font-bold text-blue-900 mt-1">{sections["5_market_sizing"].sam}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Serviceable target consumers</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">SOM (Realistic 3-Yr Capture)</span>
                    <p className="text-base font-bold text-emerald-900 mt-1">{sections["5_market_sizing"].som}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Defensible local capture</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3">
                <span className="font-semibold text-slate-700">Methodology: </span>
                {sections["5_market_sizing"]?.methodology}
              </p>
            </div>

            {/* 6. Local Market Analysis */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>6. Local Catchment Dynamics ({project?.idea?.city_region})</span>
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {sections["6_local_market_analysis"]}
              </p>
            </div>

            {/* 7. Competitor Comparison Table */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>7. Competitor Comparison Matrix</span>
                </h2>
                <Link
                  href={`/analysis/${projectId}/competitors`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Open Interactive Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 font-semibold">Competitor</th>
                      <th className="py-2.5 font-semibold">Type</th>
                      <th className="py-2.5 font-semibold">Est. Price</th>
                      <th className="py-2.5 font-semibold">Observed Strengths</th>
                      <th className="py-2.5 font-semibold">Unmet Market Gaps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sections["7_competitor_comparison"]?.map((c: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-900">{c.name}</td>
                        <td className="py-3 uppercase text-[10px] font-medium text-slate-500">{c.category}</td>
                        <td className="py-3 font-medium text-slate-900">INR {c.est_price}</td>
                        <td className="py-3 text-slate-600">{c.strengths?.slice(0, 2).join(", ")}</td>
                        <td className="py-3 text-blue-700 font-medium">{c.market_gaps?.slice(0, 2).join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8. Customer Personas */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>8. Evidence-Based Customer Archetypes</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections["8_customer_personas"]?.map((p: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        Budget: {p.budget_sensitivity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{p.demographics}</p>
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <p className="text-[11px] text-slate-700">
                        <span className="font-semibold text-red-600">Core Frustrations: </span>
                        {p.core_problems?.join("; ")}
                      </p>
                      <p className="text-[11px] text-slate-700">
                        <span className="font-semibold text-emerald-600">Purchasing Drivers: </span>
                        {p.motivations?.join("; ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL FEASIBILITY */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            {/* Financial Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Break-Even Units</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatNumber(sections["13_break_even_analysis"]?.break_even_units_monthly)} / mo
                </p>
                <p className="text-xs text-slate-500 mt-1">Operational survival threshold</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Break-Even Revenue</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {formatINR(sections["13_break_even_analysis"]?.break_even_revenue_monthly)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Monthly minimum revenue</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Contribution</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {formatPercent(sections["10_pricing_positioning"]?.gross_margin_pct)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Unit cash generation</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Year 1 Net Profit</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatINR(sections["12_financial_forecasts"]?.year1_net_profit)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Base scenario forecast</p>
              </div>
            </div>

            {/* Pricing Tiers & Positioning */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>10. Pricing & Value Positioning</span>
                </h2>
                <Link
                  href={`/analysis/${projectId}/simulator`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Interactive Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget / Intro Tier</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {formatINR(sections["10_pricing_positioning"]?.budget_tier)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Acquisition & trial offer</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Recommended Launch Price</span>
                  <p className="text-xl font-black text-blue-900 mt-1">
                    {formatINR(sections["10_pricing_positioning"]?.recommended_launch_price)}
                  </p>
                  <p className="text-[11px] text-blue-700 font-medium mt-1">Optimal margin balance</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium Experience Tier</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {formatINR(sections["10_pricing_positioning"]?.premium_tier)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Curated bundles / masterclasses</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Positioning Statement: </span>
                {sections["10_pricing_positioning"]?.positioning_statement}
              </p>
            </div>

            {/* 14. 3-Scenario Comparison */}
            {sections["14_scenario_comparison"] && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>14. Sensitivity & Scenario Stress-Testing</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700">Conservative (-30% Vol)</span>
                    <p className="text-xs text-slate-500">Revenue: <b className="text-slate-800">{formatINR(sections["14_scenario_comparison"].conservative?.annual_revenue)}</b></p>
                    <p className="text-xs text-slate-500">Net Profit: <b className="text-slate-800">{formatINR(sections["14_scenario_comparison"].conservative?.annual_net_profit)}</b></p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                    <span className="text-xs font-bold text-blue-800">Base Scenario (Target Vol)</span>
                    <p className="text-xs text-slate-600">Revenue: <b className="text-blue-900">{formatINR(sections["14_scenario_comparison"].base?.annual_revenue)}</b></p>
                    <p className="text-xs text-slate-600">Net Profit: <b className="text-blue-900">{formatINR(sections["14_scenario_comparison"].base?.annual_net_profit)}</b></p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-800">Optimistic (+30% Vol)</span>
                    <p className="text-xs text-slate-600">Revenue: <b className="text-emerald-900">{formatINR(sections["14_scenario_comparison"].optimistic?.annual_revenue)}</b></p>
                    <p className="text-xs text-slate-600">Net Profit: <b className="text-emerald-900">{formatINR(sections["14_scenario_comparison"].optimistic?.annual_net_profit)}</b></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RISKS & 90-DAY ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            {/* 18. Risk Assessment & Mitigations */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>18. Risk Matrix & Mitigations</span>
              </h2>

              <div className="space-y-3">
                {sections["18_risk_assessment"]?.map((r: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{r.risk}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                        r.severity === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        Severity: {r.severity} • Likelihood: {r.likelihood}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600"><span className="font-semibold text-slate-700">Observed Evidence:</span> {r.evidence}</p>
                    <p className="text-xs text-blue-700 font-medium"><span className="font-semibold text-slate-900">Mitigation:</span> {r.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 19. 30/60/90-Day Execution Roadmap */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>19. 30/60/90-Day Phased Execution Plan</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-700">DAYS 0 — 30 (Validation)</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{sections["19_execution_roadmap"]?.days_0_30}</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                  <span className="text-xs font-bold text-indigo-700">DAYS 31 — 60 (Fit-Out & Team)</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{sections["19_execution_roadmap"]?.days_31_60}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-700">DAYS 61 — 90 (Soft Launch)</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{sections["19_execution_roadmap"]?.days_61_90}</p>
                </div>
              </div>
            </div>

            {/* 20. Inexpensive Validation Experiments */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>20. Inexpensive Pre-Launch Validation Experiments</span>
              </h2>
              <ul className="space-y-2">
                {sections["20_validation_experiments"]?.map((exp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 22. Citations & Sources */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>22. Evidence Citations & Research Provenance</span>
              </h2>
              <div className="space-y-2">
                {sections["22_sources_citations"]?.map((src: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-900">{src.title} ({src.publisher})</span>
                    {src.url && (
                      <a href={src.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
