"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { Project } from "@/lib/types";
import {
  History,
  FileText,
  SlidersHorizontal,
  Trash2,
  MapPin,
  ArrowRight,
  PlusCircle,
  Clock,
  Compass
} from "lucide-react";

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this project analysis?")) {
      try {
        await api.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AppShell
      title="Project Archive & History"
      subtitle="Reopen previous feasibility dossiers, compare simulations, and manage saved ventures"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{projects.length}</span> saved project analyses
          </p>
          <Link
            href="/new-analysis"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading archive...
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No projects found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start your first product feasibility evaluation to build an archive of market insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      proj.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {proj.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{proj.name}</h3>

                  {proj.idea && (
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{proj.idea.city_region}, {proj.idea.country}</span>
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {proj.idea.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/analysis/${proj.id}/report`}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </Link>
                    <Link
                      href={`/analysis/${proj.id}/simulator`}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Simulator</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/analysis/${proj.id}`}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Open Workspace"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {!proj.id.startsWith("demo-") && (
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
