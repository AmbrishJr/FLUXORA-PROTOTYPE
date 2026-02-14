import { motion } from "framer-motion";
function MultipleRoutes({ routes, onSelectRoute, selectedRouteIndex }) {
  if (!routes || routes.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        <p>No routes available</p>
      </div>
    );
  }

  const getStrategyIcon = (strategy) => {
    switch (strategy) {
      case "Fastest Route":
        return "⚡";
      case "Least Congestion":
        return "🟢";
      case "Scenic Route":
        return "🎋";
      case "Shortest Distance":
        return "📏";
      default:
        return "🛣️";
    }
  };

  const getStrategyColor = (strategy) => {
    switch (strategy) {
      case "Fastest Route":
        return "text-blue-400";
      case "Least Congestion":
        return "text-emerald-400";
      case "Scenic Route":
        return "text-amber-400";
      case "Shortest Distance":
        return "text-purple-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300 mb-3">Route Options</h3>
      
      {routes.map((route, index) => (
        <motion.div
          key={`${route.strategy}-${index}-${route.total_time}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          onClick={() => onSelectRoute(index)}
          className={`p-3 rounded-xl border cursor-pointer transition-all ${
            selectedRouteIndex === index
              ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
              : "border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/80"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getStrategyIcon(route.strategy)}</span>
                <span className={`text-sm font-medium ${getStrategyColor(route.strategy)}`}>
                  {route.strategy}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Time:</span>
                  <span className="ml-1 text-slate-200">{route.total_time} min</span>
                </div>
                <div>
                  <span className="text-slate-400">Congestion:</span>
                  <span className="ml-1 text-slate-200">{route.congestion_score}</span>
                </div>
              </div>
              
              {route.explanation && (
                <p className="text-xs text-slate-300 italic mt-2">
                  {route.explanation}
                </p>
              )}
              
              {route.confidence && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-slate-400">Confidence:</span>
                  <span className={`text-xs ${
                    route.confidence === "High" ? "text-emerald-400" :
                    route.confidence === "Medium" ? "text-yellow-400" : "text-rose-400"
                  }`}>
                    {route.confidence}
                  </span>
                </div>
              )}
              
              {route.reward_points && (
                <div className="mt-2 text-xs text-emerald-300 font-medium">
                  🎁 Reward: {route.reward_points} pts
                </div>
              )}
            </div>
            
            {selectedRouteIndex === index && (
              <div className="ml-3">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
      
      <div className="text-xs text-slate-400 mt-3">
        Click on any route to view it on the map
      </div>
    </div>
  );
}

export default MultipleRoutes;
