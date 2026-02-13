import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import PostEventInsights from "./PostEventInsights";

function MetricCard({ label, value, suffix, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true, amount: 0.5 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
    >
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">
        {value}
        {suffix}
      </p>
    </motion.div>
  );
}

/**
 * Dashboard component
 * - Shows metric cards
 * - Simple area chart for congestion trend (derived from current stats)
 */
function Dashboard({ stats, showPostEventInsights = false }) {
  const safeStats = stats || {
    total_routes_calculated: 0,
    total_incentives_given: 0,
    avg_congestion: 0
  };

  // Calculate City Flow Stress Index
  const getCityFlowStressIndex = () => {
    const baseIndex = safeStats.avg_congestion / 2; // Normalize to 0-1 range
    const routeFactor = Math.min(safeStats.total_routes_calculated / 100, 0.3); // Add route volume factor
    const stressIndex = Math.min(baseIndex + routeFactor, 1);
    return stressIndex.toFixed(2);
  };

  const getStressLabel = (index) => {
    const num = parseFloat(index);
    if (num < 0.3) return "Low";
    if (num < 0.7) return "Moderate";
    return "High";
  };

  const getStressColor = (label) => {
    switch (label) {
      case "Low": return "text-emerald-400";
      case "Moderate": return "text-yellow-400";
      case "High": return "text-rose-400";
      default: return "text-slate-400";
    }
  };

  const stressIndex = getCityFlowStressIndex();
  const stressLabel = getStressLabel(stressIndex);
  const stressColor = getStressColor(stressLabel);

  // Lightweight "trend" data based on current stats
  const chartData = [
    { label: "Low", routes: safeStats.total_routes_calculated * 0.3 },
    { label: "Mid", routes: safeStats.total_routes_calculated * 0.7 },
    { label: "Now", routes: safeStats.total_routes_calculated || 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <MetricCard
          label="Routes calculated"
          value={safeStats.total_routes_calculated}
          index={0}
        />
        <MetricCard
          label="Incentives given"
          value={safeStats.total_incentives_given}
          index={1}
        />
        <MetricCard
          label="Avg congestion"
          value={safeStats.avg_congestion}
          suffix=""
          index={2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          viewport={{ once: true, amount: 0.5 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <p className="text-xs text-slate-400">City Flow Stress Index</p>
          <p className="text-2xl font-semibold mt-1">
            {stressIndex}
            <span className={`ml-2 text-sm font-medium ${stressColor}`}>
              {stressLabel}
            </span>
          </p>
        </motion.div>
      </div>

      <PostEventInsights show={showPostEventInsights} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        viewport={{ once: true, amount: 0.4 }}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300"
      >
        <p className="font-medium mb-1">Routes trend (demo)</p>
        <p className="text-xs text-slate-400 mb-3">
          Simple area chart driven by the total routes count – enough for a
          hackathon demo.
        </p>
        <div className="h-40 rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="routesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#1e293b",
                  borderRadius: 8,
                  fontSize: 11
                }}
              />
              <Area
                type="monotone"
                dataKey="routes"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#routesGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;

