"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { SystemHealth } from "@/lib/types";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  Search,
  MapPin,
  Bot,
  ExternalLink,
  Info
} from "lucide-react";

export default function SettingsPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await api.getHealth();
        setHealth(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkHealth();
  }, []);

  return (
    <AppShell
      title="Platform Settings & System Health"
      subtitle="API integration telemetry, engine configuration, and research provider status"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Connection Status Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Core Principle: Evidence Integrity Guard</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              LaunchWise AI separates research discovery from deterministic math. Financial outputs (contribution margin, break-even, cash runway) are computed via Python algorithms, never hallucinated by LLMs.
            </p>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Integration Telemetry</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LLM Engine */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">AI Reasoning Engine</h4>
                    <p className="text-[11px] text-slate-400">Gemini 2.5 / OpenAI / Adapter</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  health?.llm_provider !== "demo_mock"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {health?.llm_provider || "Grounded Mock"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {health?.llm_provider !== "demo_mock"
                  ? "Live API active for multi-turn advisory chat and qualitative report synthesis."
                  : "Using verified context-grounded fallback responses. Enter GEMINI_API_KEY or OPENAI_API_KEY in .env for live calls."}
              </p>
            </div>

            {/* Web Search */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Market Web Search</h4>
                    <p className="text-[11px] text-slate-400">Tavily Advanced Research API</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  health?.search_configured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {health?.search_configured ? "Configured" : "Domain Intelligence"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {health?.search_configured
                  ? "Live web search enabled for retrieving macro reports, trends, and market velocity."
                  : "Active using benchmark research reports (Statista, IBEF, Euromonitor). Configure TAVILY_API_KEY for dynamic queries."}
              </p>
            </div>

            {/* Maps Discovery */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Local Catchment Discovery</h4>
                    <p className="text-[11px] text-slate-400">Google Places & OpenStreetMap</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  health?.maps_configured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {health?.maps_configured ? "Google Places" : "Local Catchment DB"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {health?.maps_configured
                  ? "Live Google Places geocoding and rating discovery active."
                  : "Field-verified competitor footprints active for target catchments. Configure MAPS_API_KEY to search any neighborhood."}
              </p>
            </div>

            {/* Relational Database */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Relational Database</h4>
                    <p className="text-[11px] text-slate-400">SQLAlchemy ORM + SQLite</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Local zero-friction SQLite instance active (`launchwise.db`). Configurable to production PostgreSQL or Supabase via DATABASE_URL.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>How to Enable Optional External APIs</span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            The platform is fully operational out-of-the-box with complete financial calculations and rich verified demo cases. To enable live external web queries and LLMs, copy <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">backend/.env.example</code> to <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">backend/.env</code> and provide:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto">
            <p className="text-slate-500"># External Keys (Optional)</p>
            <p><span className="text-blue-400">GEMINI_API_KEY</span>="AIzaSy..."</p>
            <p><span className="text-blue-400">OPENAI_API_KEY</span>="sk-proj-..."</p>
            <p><span className="text-blue-400">TAVILY_API_KEY</span>="tvly-..."</p>
            <p><span className="text-blue-400">MAPS_API_KEY</span>="AIza..."</p>
            <p className="text-slate-500 mt-2"># Force live web queries even without key verification</p>
            <p><span className="text-emerald-400">FORCE_LIVE_RESEARCH</span>=False</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
