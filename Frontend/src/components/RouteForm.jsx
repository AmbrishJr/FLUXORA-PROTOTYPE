import { motion } from "framer-motion";

// PROTOTYPE_MODE:
// Fixed set of smart city locations used for routing.
// This keeps the demo predictable and easy to explain.
export const PROTOTYPE_LOCATIONS = [
  { id: "A", name: "Anna Nagar", coordinates: [80.2185, 13.0878] },
  { id: "B", name: "T Nagar", coordinates: [80.2341, 13.0418] },
  { id: "C", name: "Guindy", coordinates: [80.2209, 13.0067] },
  { id: "D", name: "Velachery", coordinates: [80.2180, 12.9791] }
];

/**
 * RouteForm
 * - Collects source & destination using fixed prototype locations
 * - Triggers route calculation
 * - Shows loading state with a small spinner
 */
function RouteForm({
  sourceId,
  destinationId,
  onChangeSource,
  onChangeDestination,
  onSubmit,
  isLoading
}) {
  const disabled =
    isLoading || !sourceId || !destinationId || sourceId === destinationId;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Starting Location</label>
          <select
            value={sourceId}
            onChange={(e) => onChangeSource(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-accent/70"
          >
            <option value="">Select source...</option>
            {PROTOTYPE_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-slate-400 mb-1">Destination</label>
          <select
            value={destinationId}
            onChange={(e) => onChangeDestination(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-accent/70"
          >
            <option value="">Select destination...</option>
            {PROTOTYPE_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-slate-950 text-sm font-medium shadow-md shadow-accent/40 hover:shadow-accent/60 disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading && (
            <span className="h-3 w-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          )}
          <span>{isLoading ? "Calculating..." : "Calculate Route"}</span>
        </motion.button>
      </div>
    </form>
  );
}

export default RouteForm;

