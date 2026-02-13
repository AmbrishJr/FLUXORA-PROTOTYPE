import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDashboard } from "../api/dashboard";
import Dashboard from "../components/Dashboard";

function DashboardPage() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showPostEventInsights, setShowPostEventInsights] = useState(false);
  
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 4000
  });

  const stats =
    data || {
      total_routes_calculated: 0,
      total_incentives_given: 0,
      avg_congestion: 0
    };

  return (
    <section className="mx-auto max-w-6xl px-4 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Fluxora Dashboard</h2>
          <p className="text-sm text-slate-400">
            High-level snapshot you can talk through during your demo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPostEventInsights(!showPostEventInsights)}
            className={`px-3 py-1 rounded-full border text-[11px] transition-colors ${
              showPostEventInsights
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/10"
                : "border-slate-600 text-slate-300 bg-slate-900/80"
            }`}
          >
            {showPostEventInsights ? "Hide Insights" : "Show Insights"}
          </button>
          <span className="text-xs text-slate-400">Emergency Mode</span>
          <button
            type="button"
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              emergencyMode ? "bg-rose-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emergencyMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {emergencyMode && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm">
          <p className="text-rose-300 font-medium">
            Emergency Mode Active
          </p>
          <p className="text-rose-200/80 text-xs mt-1">
            Priority routing enabled for emergency vehicles. Traffic signals synchronized.
          </p>
        </div>
      )}

      <Dashboard stats={stats} showPostEventInsights={showPostEventInsights} />
    </section>
  );
}

export default DashboardPage;

