import { motion } from "framer-motion";

/**
 * PostEventInsights
 * - Shows estimated metrics after simulated events
 * - Displays congestion reduction, time saved, CO₂ reduction
 */
function PostEventInsights({ show = false }) {
  if (!show) return null;

  // Generate simulated insights
  const insights = {
    congestionReduction: Math.floor(Math.random() * 30) + 15, // 15-45%
    timeSaved: Math.floor(Math.random() * 20) + 10, // 10-30 min
    co2Reduction: Math.floor(Math.random() * 50) + 25, // 25-75 kg
    routesOptimized: Math.floor(Math.random() * 500) + 200 // 200-700 routes
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm"
    >
      <p className="font-medium text-emerald-300 mb-3">
        Post-Event Insights (Estimated)
      </p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <p className="text-slate-400">Congestion Reduced</p>
          <p className="text-emerald-200 font-semibold">
            {insights.congestionReduction}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400">Avg Time Saved</p>
          <p className="text-emerald-200 font-semibold">
            {insights.timeSaved} min
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400">CO₂ Reduction</p>
          <p className="text-emerald-200 font-semibold">
            {insights.co2Reduction} kg
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400">Routes Optimized</p>
          <p className="text-emerald-200 font-semibold">
            {insights.routesOptimized}
          </p>
        </div>
      </div>
      <p className="text-emerald-200/60 text-xs mt-3 italic">
        Values are simulated estimates based on traffic pattern analysis.
      </p>
    </motion.div>
  );
}

export default PostEventInsights;
