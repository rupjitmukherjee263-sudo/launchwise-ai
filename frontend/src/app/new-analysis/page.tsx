"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { ProductIdea } from "@/lib/types";
import {
  Compass,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  FileCheck,
  Check,
  HelpCircle,
  Building2,
  MapPin,
  Banknote,
  Package
} from "lucide-react";

export default function NewAnalysisPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [quickStart, setQuickStart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductIdea>({
    title: "",
    description: "",
    category: "Food & Beverage / Specialty Retail",
    country: "India",
    city_region: "",
    target_demographic: "",
    intended_price: 250,
    estimated_cost: 65,
    startup_budget: 1500000,
    monthly_expenses: 180000,
    target_monthly_sales: 1800,
    distribution_channel: "hybrid",
    business_model: "B2C",
    usp: "",
    founder_resources: "",
  });

  const loadSample = (type: "cafe" | "kombucha") => {
    if (type === "cafe") {
      setFormData({
        title: "Artisanal Single-Origin Specialty Coffee Bar",
        description: "A high-focus, single-estate pour-over and espresso bar offering transparent farm-to-cup traceability, silent acoustic workspace zones, and artisanal pastries in Indiranagar, Bengaluru.",
        category: "Food & Beverage / Specialty Retail",
        country: "India",
        city_region: "Indiranagar, Bengaluru",
        target_demographic: "Tech founders, software engineers, and remote design professionals aged 23-40 with disposable monthly income > INR 90,000.",
        intended_price: 280,
        estimated_cost: 72,
        startup_budget: 2400000,
        monthly_expenses: 280000,
        target_monthly_sales: 2200,
        distribution_channel: "hybrid",
        business_model: "B2C / Walk-in & Corporate Subscription",
        usp: "Exclusive direct-trade micro-lot coffee beans from Chikmagalur estates paired with acoustically treated, ergonomic deep-work booths.",
        founder_resources: "Certified Q-Grader head barista with 6 years experience in specialty coffee roasting."
      });
    } else {
      setFormData({
        title: "Raw Organic Functional Kombucha & Wellness Elixirs",
        description: "Small-batch glass-bottled probiotic raw kombucha brewed with indigenous Himalayan green teas and cold-pressed botanicals for gut health, distributed across premium fitness gyms and organic grocers.",
        category: "Health Food & Functional Beverage",
        country: "India",
        city_region: "Bandra West, Mumbai",
        target_demographic: "Health-conscious urban consumers, pilates and crossfit members, corporate executives aged 24-45 with monthly wellness budgets > INR 15,000.",
        intended_price: 190,
        estimated_cost: 48,
        startup_budget: 1600000,
        monthly_expenses: 190000,
        target_monthly_sales: 2600,
        distribution_channel: "hybrid",
        business_model: "D2C Online & B2B Premium Retail",
        usp: "100% cold-chain raw unpasteurized probiotic culture with under 3g natural sugar per bottle, sweetened only with raw monk fruit.",
        founder_resources: "Biochemist with 5 years fermentation R&D and distribution network across 18 fitness studios."
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.city_region) {
      setError("Please fill in the required fields (Product Title, Description, and Launch City/Region).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const proj = await api.createProject(formData.title, formData);
      // Launch analysis pipeline immediately
      await api.startAnalysis(proj.id);
      router.push(`/analysis/${proj.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to initialize analysis. Please check backend connection.");
      setLoading(false);
    }
  };

  return (
    <AppShell title="Launch Intelligence Wizard" subtitle="Configure business parameters for multi-stage market research and financial feasibility">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Sample Case Loaders & Mode Switcher */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Quick-Load Verified Presets</span>
            </h3>
            <p className="text-xs text-slate-500">Populate the wizard with real benchmark market data</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadSample("cafe")}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 transition-colors"
            >
              Bengaluru Café
            </button>
            <button
              type="button"
              onClick={() => loadSample("kombucha")}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 transition-colors"
            >
              Mumbai Kombucha
            </button>
            <button
              type="button"
              onClick={() => setQuickStart(!quickStart)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                quickStart ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              {quickStart ? "Quick-Start Mode: ON" : "Quick-Start Mode"}
            </button>
          </div>
        </div>

        {/* Wizard Multi-Step Header (Hidden in Quick Start) */}
        {!quickStart && (
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-semibold pb-2 border-b-2 -mb-4 transition-colors ${
                step === 1 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">1</span>
              <span>Idea & Geography</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 text-xs font-semibold pb-2 border-b-2 -mb-4 transition-colors ${
                step === 2 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px]">2</span>
              <span>Financial Estimates</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 text-xs font-semibold pb-2 border-b-2 -mb-4 transition-colors ${
                step === 3 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px]">3</span>
              <span>Positioning & Channels</span>
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* STEP 1: Idea & Location */}
          {(step === 1 || quickStart) && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Product or Business Concept <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Single-Origin Cold Brew Bar & Focused Co-Working"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Detailed Concept Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe customer pain point, value proposition, and intended operational format..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Category or Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Food & Beverage / Health Retail"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Target City, Region, or Catchment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city_region}
                    onChange={(e) => setFormData({ ...formData, city_region: e.target.value })}
                    placeholder="e.g. Indiranagar, Bengaluru or Bandra West, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Target Customer Demographic (Optional)
                </label>
                <input
                  type="text"
                  value={formData.target_demographic || ""}
                  onChange={(e) => setFormData({ ...formData, target_demographic: e.target.value })}
                  placeholder="e.g. Urban knowledge professionals aged 24-40 with monthly tech compensation > INR 80,000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Financial Estimates (Shown if step 2 and not quick start) */}
          {step === 2 && !quickStart && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                Leave unknown estimates blank or use estimates. The AI engine uses deterministic math to calculate margins and break-even.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Intended Selling Price (INR)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.intended_price || ""}
                    onChange={(e) => setFormData({ ...formData, intended_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Unit Procurement / Production Cost (INR)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.estimated_cost || ""}
                    onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Initial Startup CapEx (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.startup_budget || ""}
                    onChange={(e) => setFormData({ ...formData, startup_budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Monthly Fixed Overhead (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.monthly_expenses || ""}
                    onChange={(e) => setFormData({ ...formData, monthly_expenses: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Target Monthly Units Sold
                  </label>
                  <input
                    type="number"
                    value={formData.target_monthly_sales || ""}
                    onChange={(e) => setFormData({ ...formData, target_monthly_sales: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Positioning & Channels */}
          {step === 3 && !quickStart && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Distribution Channel
                  </label>
                  <select
                    value={formData.distribution_channel}
                    onChange={(e) => setFormData({ ...formData, distribution_channel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  >
                    <option value="hybrid">Hybrid (Walk-in Retail & D2C Delivery)</option>
                    <option value="offline">Offline Physical Retail / Experience Center</option>
                    <option value="online">Online D2C Quick-Commerce</option>
                    <option value="b2b">B2B Wholesale / Institutional Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                    Business Model
                  </label>
                  <select
                    value={formData.business_model}
                    onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                  >
                    <option value="B2C">B2C Retail Transactions</option>
                    <option value="Subscription">Monthly Membership / Subscription</option>
                    <option value="D2C">Direct-to-Consumer Digital</option>
                    <option value="B2B2C">B2B2C Corporate Pantry Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Unique Selling Proposition (USP)
                </label>
                <textarea
                  rows={2}
                  value={formData.usp || ""}
                  onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                  placeholder="e.g. Single-estate direct trade beans with zero noise acoustic pods"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Founder Background & Resources
                </label>
                <input
                  type="text"
                  value={formData.founder_resources || ""}
                  onChange={(e) => setFormData({ ...formData, founder_resources: e.target.value })}
                  placeholder="e.g. 6 years culinary/roasting experience, existing network of 12 corporate partners"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Buttons Navigation */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {!quickStart && step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {!quickStart && step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <span>Continue to Step {step + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <span>Launching Pipeline...</span>
                  ) : (
                    <>
                      <span>Launch Market Analysis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
