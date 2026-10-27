"use client";

import { useEffect, useState, use } from "react";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { Competitor, Project } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  Users,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Building2,
  Sparkles
} from "lucide-react";

export default function CompetitorsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, compData] = await Promise.all([
          api.getProject(projectId).catch(() => null),
          api.getCompetitors(projectId).catch(() => []),
        ]);
        if (projData) setProject(projData);
        setCompetitors(compData || []);
        if (compData && compData.length > 0) {
          setSelectedComp(compData[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  const filtered = competitors.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || c.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <AppShell
      projectId={projectId}
      title="Catchment Competitor Intelligence"
      subtitle={`Geographical scan of competitors operating in ${project?.idea?.city_region || "target area"}`}
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search competitors or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({competitors.length})
              </button>
              <button
                onClick={() => setCategoryFilter("direct")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryFilter === "direct"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setCategoryFilter("indirect")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  categoryFilter === "indirect"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Indirect
              </button>
            </div>
          </div>

          <a
            href={api.getCompetitorsCsvUrl(projectId)}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>

        {/* 2-Column: Competitor Table & Detail Preview + Catchment Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Table List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Discovered Catchment Competitors ({filtered.length})
              </h3>
              <span className="text-[11px] text-slate-400">Click a record to inspect differentiation gaps</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">Loading competitors...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">No competitors matching filters.</div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                {filtered.map((c) => {
                  const isSelected = selectedComp?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedComp(c)}
                      className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected ? "bg-blue-50/60 border-l-4 border-l-blue-600" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                            c.category === "direct" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {c.category}
                          </span>
                          {c.is_verified && (
                            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{c.address || c.location}</span>
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600">
                          <span>Est. Price: <b className="text-slate-900">INR {c.est_price || 250}</b></span>
                          <span className="text-slate-300">•</span>
                          <span className="line-clamp-1">Gap: <b className="text-blue-600">{c.market_gaps?.[0] || "Specialty craft"}</b></span>
                        </div>
                      </div>

                      {c.source_url && (
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Competitor Detail Card & Map Pins */}
          <div className="space-y-6">
            {selectedComp ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {selectedComp.category} Competitor
                    </span>
                    {selectedComp.is_verified ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        {selectedComp.verification_source}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        Unverified
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedComp.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedComp.address || selectedComp.location}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="text-slate-500">Public Pricing & Offerings:</span>
                  <p className="font-semibold text-slate-800">{selectedComp.pricing_summary || "INR 240 - 360 standard range"}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-700 block mb-1">Observed Strengths:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {selectedComp.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-red-700 block mb-1">Customer Complaints / Weaknesses:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {selectedComp.weaknesses?.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
                    <span className="font-bold text-blue-900 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Founder Differentiation Wedge:</span>
                    </span>
                    <ul className="list-disc list-inside text-blue-800 space-y-0.5 pl-1">
                      {selectedComp.market_gaps?.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Select a competitor to inspect
              </div>
            )}

            {/* Geographical Catchment Map Visualization */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Catchment Density Pinboard</span>
                </h4>
                <span className="text-[10px] text-slate-400">5km radius scan</span>
              </div>

              {/* Styled Mock Map Canvas */}
              <div className="h-44 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center p-3">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Proposed Store Anchor Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold animate-bounce">
                    ★
                  </div>
                  <span className="text-[9px] font-bold text-blue-900 bg-white/90 px-1 rounded shadow-xs mt-0.5">
                    Your Proposed Site
                  </span>
                </div>

                {/* Surrounding Competitor Pins */}
                {competitors.slice(0, 4).map((c, idx) => {
                  const offsets = [
                    { top: "22%", left: "25%" },
                    { top: "28%", left: "75%" },
                    { top: "72%", left: "30%" },
                    { top: "68%", left: "70%" },
                  ];
                  const pos = offsets[idx % offsets.length];
                  const isSel = selectedComp?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedComp(c)}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                    >
                      <div className={`w-4 h-4 rounded-full border border-white shadow-xs flex items-center justify-center text-[8px] font-bold transition-all ${
                        isSel ? "bg-red-600 scale-125 ring-2 ring-red-400 text-white" : "bg-slate-700 text-white"
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-[8px] font-medium text-slate-700 bg-white/90 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Physical cluster mapping around {project?.idea?.city_region || "target market"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
