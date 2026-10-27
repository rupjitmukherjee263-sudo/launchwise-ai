"use client";

import { useEffect, useState, use } from "react";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { FinancialReport, Project } from "@/lib/types";
import { formatINR, formatNumber, formatPercent } from "@/lib/utils";
import {
  SlidersHorizontal,
  TrendingUp,
  Save,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  BarChart3,
  Scale
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function FinancialSimulatorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [model, setModel] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable simulation inputs
  const [price, setPrice] = useState<number>(280);
  const [cost, setCost] = useState<number>(72);
  const [fixed, setFixed] = useState<number>(240000);
  const [targetSales, setTargetSales] = useState<number>(2000);
  const [investment, setInvestment] = useState<number>(2000000);
  const [scenario, setScenario] = useState<"base" | "conservative" | "optimistic">("base");

  // Load project defaults
  useEffect(() => {
    async function loadData() {
      try {
        const [projData, finData] = await Promise.all([
          api.getProject(projectId).catch(() => null),
          api.getFinancials(projectId).catch(() => null),
        ]);
        if (projData) setProject(projData);
        if (finData) {
          setModel(finData);
          setPrice(finData.unit_economics.selling_price);
          setCost(finData.unit_economics.variable_cost_per_unit);
          setFixed(finData.projections_12_months[0]?.fixed_costs || 240000);
          setTargetSales(finData.break_even.target_monthly_sales);
          setInvestment(finData.base_scenario.annual_units > 0 ? 2000000 : 1500000);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  // Recalculate model upon input changes
  const runSimulation = async (newPrice: number, newCost: number, newFixed: number, newSales: number, newInv: number) => {
    try {
      const res = await api.simulateFinancials({
        selling_price: Math.max(1, newPrice),
        variable_cost_per_unit: Math.max(0, newCost),
        fixed_monthly_costs: Math.max(0, newFixed),
        initial_startup_investment: Math.max(0, newInv),
        target_monthly_sales: Math.max(1, newSales),
        tax_rate: 0.18,
      });
      setModel(res);
      setSaveSuccess(false);
    } catch (e) {
      console.error("Simulation error:", e);
    }
  };

  const handlePriceChange = (val: number) => {
    setPrice(val);
    runSimulation(val, cost, fixed, targetSales, investment);
  };

  const handleCostChange = (val: number) => {
    setCost(val);
    runSimulation(price, val, fixed, targetSales, investment);
  };

  const handleFixedChange = (val: number) => {
    setFixed(val);
    runSimulation(price, cost, val, targetSales, investment);
  };

  const handleSalesChange = (val: number) => {
    setTargetSales(val);
    runSimulation(price, cost, fixed, val, investment);
  };

  const handleInvestmentChange = (val: number) => {
    setInvestment(val);
    runSimulation(price, cost, fixed, targetSales, val);
  };

  const handleSaveAssumptions = async () => {
    setSaving(true);
    try {
      await api.saveFinancials(projectId, {
        selling_price: price,
        variable_cost_per_unit: cost,
        fixed_monthly_costs: fixed,
        initial_startup_investment: investment,
        target_monthly_sales: targetSales,
        tax_rate: 0.18,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell projectId={projectId} title="Financial Feasibility Simulator">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
          Loading financial calculation engine...
        </div>
      </AppShell>
    );
  }

  const currentScenario =
    scenario === "conservative"
      ? model?.conservative_scenario
      : scenario === "optimistic"
      ? model?.optimistic_scenario
      : model?.base_scenario;

  const chartData = model?.projections_12_months.map((p) => ({
    month: `M${p.month}`,
    revenue: p.revenue,
    grossProfit: p.gross_profit,
    fixedCosts: p.fixed_costs,
    operatingProfit: p.operating_profit,
    cashFlow: p.cumulative_cash_flow,
  })) || [];

  return (
    <AppShell
      projectId={projectId}
      title="Financial Feasibility Simulator"
      subtitle="Interactive deterministic sensitivity model with instant unit-economics recalculation"
    >
      <div className="space-y-6">
        {/* Top Control Bar with Save */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Scenario Preset:
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setScenario("conservative")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  scenario === "conservative" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Conservative (-30%)
              </button>
              <button
                type="button"
                onClick={() => setScenario("base")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  scenario === "base" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Base Case
              </button>
              <button
                type="button"
                onClick={() => setScenario("optimistic")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  scenario === "optimistic" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Optimistic (+30%)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Assumptions Saved</span>
              </span>
            )}
            <button
              onClick={handleSaveAssumptions}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Assumptions to Model"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Sliders on Left, Recalculated KPIs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Input Sliders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Model Variables</span>
            </h2>

            {/* Selling Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Selling Price per Unit</span>
                <span className="font-bold text-blue-600">INR {price}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1500"
                step="10"
                value={price}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Variable Cost */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Variable Cost per Unit</span>
                <span className="font-bold text-slate-800">INR {cost}</span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="5"
                value={cost}
                onChange={(e) => handleCostChange(parseFloat(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>

            {/* Monthly Fixed Costs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Fixed Monthly Overhead</span>
                <span className="font-bold text-slate-800">{formatINR(fixed)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="1000000"
                step="10000"
                value={fixed}
                onChange={(e) => handleFixedChange(parseFloat(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>

            {/* Target Monthly Units */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Steady-State Monthly Sales</span>
                <span className="font-bold text-blue-600">{formatNumber(targetSales)} units</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={targetSales}
                onChange={(e) => handleSalesChange(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Startup Investment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Startup Capital (CapEx)</span>
                <span className="font-bold text-slate-800">{formatINR(investment)}</span>
              </div>
              <input
                type="range"
                min="200000"
                max="10000000"
                step="100000"
                value={investment}
                onChange={(e) => handleInvestmentChange(parseFloat(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Right: Recalculated Output Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Margin</span>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  {formatPercent(model?.unit_economics.contribution_margin_pct)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">INR {model?.unit_economics.contribution_per_unit} / unit</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Break-Even</span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {formatNumber(model?.break_even.break_even_units)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">monthly units</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Margin of Safety</span>
                <p className="text-xl font-black text-blue-600 mt-1">
                  {formatPercent(model?.break_even.margin_of_safety_pct)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {model?.break_even.is_attainable ? "Attainable" : "Unattainable"}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payback Timeline</span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {currentScenario?.payback_months ? `${currentScenario.payback_months} mo` : "N/A"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Capital recovery</p>
              </div>
            </div>

            {/* Annual Scenario Metrics */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Year 1 Projected Revenue</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">{formatINR(currentScenario?.annual_revenue)}</p>
              </div>
              <div>
                <span className="text-slate-500">Year 1 Operating Profit</span>
                <p className="text-base font-bold text-blue-600 mt-0.5">{formatINR(currentScenario?.annual_operating_profit)}</p>
              </div>
              <div>
                <span className="text-slate-500">Year 1 Net Profit (after tax)</span>
                <p className="text-base font-bold text-emerald-600 mt-0.5">{formatINR(currentScenario?.annual_net_profit)}</p>
              </div>
            </div>

            {/* 12-Month Projections Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>12-Month Ramp-up & Cash Flow Projections</span>
                </h3>
                <span className="text-[11px] text-slate-400">Values in INR</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`INR ${Number(value).toLocaleString()}`, ""]}
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "11px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="revenue" name="Monthly Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="operatingProfit" name="Operating Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="cashFlow" name="Cumulative Cash" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
