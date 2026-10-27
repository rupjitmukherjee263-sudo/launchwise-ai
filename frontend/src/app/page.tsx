import Link from "next/link";
import {
  TrendingUp,
  Compass,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  FileText,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
              LaunchWise <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">AI</span>
            </span>
            <p className="text-xs text-slate-400">Product Launch Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/new-analysis"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Analyze Your Idea</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-6xl w-full mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-blue-400 font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Research First. Calculate Second. Recommend with Evidence.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl">
          Know Your Market <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">
            Before You Invest.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          The intelligent business feasibility agent. Enter any product idea and launch city to discover local competitors, validate customer willingness to pay, simulate break-even economics, and receive a comprehensive 22-section launch report.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/new-analysis"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/analysis/demo-bangalore_cafe/report"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>View Sample Report (Bengaluru)</span>
          </Link>
        </div>

        {/* Core Value Pillars */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Local Competitor Discovery</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Scans target neighborhoods for direct and indirect competitors, cataloging verified pricing, physical coordinates, customer reviews, and market differentiation gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">Deterministic Financial Engine</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Zero invented numbers. Computes exact unit economics, break-even sales volume, 12-month projections, cash runway, and Conservative vs Optimistic scenarios via Python.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">22-Section Feasibility Report</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Synthesizes bottom-up TAM/SAM/SOM market sizing, customer personas, risk matrices, and 30/60/90-day validation roadmaps into exportable PDF and CSV dossiers.
            </p>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="mt-24 w-full border-t border-slate-800/80 pt-16">
          <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold text-center mb-3">
            Multi-Stage Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
            From Raw Concept to Battle-Tested Strategy
          </h3>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-blue-400">STAGE 01</span>
              <h4 className="text-sm font-semibold text-white mt-1">Idea & Target Catchment</h4>
              <p className="text-xs text-slate-400 mt-2">
                Define category, problem, intended price, and specific city or neighborhood.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-blue-400">STAGE 02</span>
              <h4 className="text-sm font-semibold text-white mt-1">Market & Competitor Scan</h4>
              <p className="text-xs text-slate-400 mt-2">
                Gather verified localized business footprints, review sentiments, and pricing data.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-blue-400">STAGE 03</span>
              <h4 className="text-sm font-semibold text-white mt-1">Financial Modeling</h4>
              <p className="text-xs text-slate-400 mt-2">
                Calculate break-even units, contribution margins, and 12-month cash flows.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-blue-400">STAGE 04</span>
              <h4 className="text-sm font-semibold text-white mt-1">Feasibility Recommendation</h4>
              <p className="text-xs text-slate-400 mt-2">
                Receive transparent Go/No-Go verdict, confidence score, and 90-day pilot roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 LaunchWise AI. Built for founders, startup studios, and retail innovators.</p>
      </footer>
    </div>
  );
}
