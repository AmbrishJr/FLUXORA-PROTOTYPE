import { motion } from "framer-motion";

/**
 * Navbar
 * - Sticky top navigation with smooth scroll handlers
 * - Links: Map, Heatmap, Dashboard, About
 */
function Navbar({ onGoHome, onGoMap, onGoHeatmap, onGoDashboard, onGoAbout }) {
  return (
    <header className="sticky top-0 inset-x-0 z-40 backdrop-blur bg-slate-950/70 border-b border-slate-800">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_#3B82F6]" />
          Fluxora
        </button>
        <div className="flex items-center gap-4 text-sm">
          <motion.button
            onClick={onGoMap}
            className="hover:text-accent transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Map
          </motion.button>
          <motion.button
            onClick={onGoHeatmap}
            className="hover:text-accent transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Heatmap
          </motion.button>
          <motion.button
            onClick={onGoDashboard}
            className="hover:text-accent transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={onGoAbout}
            className="hover:text-accent transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            About
          </motion.button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

