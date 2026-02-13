import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getHeatmap } from "../api/heatmap";
import Heatmap from "../components/Heatmap";

function HeatmapPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["heatmap"],
    queryFn: getHeatmap
  });

  const roads = data?.heatmap || [];

  return (
    <section className="mx-auto max-w-6xl px-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Congestion Heatmap</h2>
          <p className="text-sm text-slate-400">
            Real-time traffic congestion visualization across the city.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
        <div className="space-y-4">
          <Heatmap roads={roads} isLoading={isLoading} />
        </div>
        
        {/* Congestion Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm space-y-3"
        >
          <p className="font-medium">Road congestion</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {roads.map((r) => (
              <div
                key={r.road}
                className="flex items-center justify-between text-xs bg-slate-900/80 rounded-xl px-3 py-2"
              >
                <span className="font-mono">{r.road}</span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    r.congestion < 1.3
                      ? "bg-emerald-500/20 text-emerald-300"
                      : r.congestion < 1.6
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {r.congestion.toFixed(2)}
                </span>
              </div>
            ))}
            {roads.length === 0 && !isLoading && (
              <p className="text-xs text-slate-500">No roads yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeatmapPage;

