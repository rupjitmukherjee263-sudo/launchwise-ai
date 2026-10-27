"use client";

import { useEffect, useState, useRef, use } from "react";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { ChatMessage, Project } from "@/lib/types";
import { formatINR, formatNumber } from "@/lib/utils";
import {
  MessageSquareCode,
  Send,
  Sparkles,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  User,
  Bot,
  HelpCircle,
  ShieldCheck
} from "lucide-react";

export default function AssistantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Why do you think this product could succeed?",
    "What if I reduce the price by 15%?",
    "What happens if sales are half of the forecast?",
    "Which competitor poses the greatest threat?",
    "How can I start with a smaller initial budget?",
    "What should I validate before ordering inventory?",
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, histData] = await Promise.all([
          api.getProject(projectId).catch(() => null),
          api.getChatHistory(projectId).catch(() => []),
        ]);
        if (projData) setProject(projData);
        if (histData && histData.length > 0) {
          setMessages(histData);
        } else {
          // Welcome greeting
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `Hello! I am your LaunchWise AI Consultant for ${projData?.name || "this business"}. I have full context of your 22-section feasibility report, local catchment competitors, and deterministic unit-economics model. What would you like to explore or stress-test?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const resp = await api.sendMessage(projectId, query);
      setMessages((prev) => [...prev, resp]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "I encountered an issue processing that query. Please verify that your backend server is active.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      projectId={projectId}
      title="AI Startup Consultant"
      subtitle={`Interactive strategic advisor grounded in ${project?.idea?.title || "your business feasibility model"}`}
    >
      <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-140px)]">
        {/* Preset Prompt Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Suggested:</span>
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-medium shrink-0 transition-colors shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat History Box */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-slate-900 text-white"
                      : "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-2 max-w-[82%] ${isUser ? "items-end" : ""}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none font-normal"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>

                  {/* Deterministic Simulation Card if triggered */}
                  {m.simulation_triggered && m.simulation_data && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-3">
                      <div className="flex items-center justify-between text-blue-900 font-bold border-b border-blue-200 pb-2">
                        <span className="flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                          <span>Deterministic Sensitivity Calculation</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">
                          Formula Computed
                        </span>
                      </div>

                      {m.simulation_data.type === "price_reduction" && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Original Price</span>
                            <span className="font-semibold text-slate-800">INR {m.simulation_data.original_price}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Simulated Price</span>
                            <span className="font-bold text-blue-700">INR {m.simulation_data.simulated_price}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Break-Even Delta</span>
                            <span className="font-bold text-amber-700">
                              {m.simulation_data.original_break_even} → {m.simulation_data.simulated_break_even} units
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Annual Net Profit</span>
                            <span className="font-bold text-slate-900">{formatINR(m.simulation_data.simulated_annual_net)}</span>
                          </div>
                        </div>
                      )}

                      {m.simulation_data.type === "sales_drop" && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Original Units</span>
                            <span className="font-semibold text-slate-800">{m.simulation_data.original_units}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Simulated Units</span>
                            <span className="font-bold text-red-600">{m.simulation_data.simulated_units}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Simulated Revenue</span>
                            <span className="font-bold text-slate-900">{formatINR(m.simulation_data.simulated_annual_revenue)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Runway Impact</span>
                            <span className="font-bold text-amber-700">{m.simulation_data.cash_runway_months || 5.2} months</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block px-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Analyzing context & calculating formulas...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask about competitor threats, budget adjustments, or price sensitivity..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white shadow-xs"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
