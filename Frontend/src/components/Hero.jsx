import { motion } from "framer-motion";

/**
 * Hero
 * - Full-screen landing hero with animated background & CTA
 * - "Get Started" button scrolls to the Map section
 */
function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-96 bg-gradient-to-r from-accent/10 via-transparent to-emerald-500/10 blur-2xl" />
      </div>

      {/* Floating "car" indicators to suggest movement */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-1/3 h-2 w-6 rounded-full bg-accent/80 blur-[1px] animate-[bounce_3s_infinite]" />
        <div className="absolute right-16 top-1/4 h-2 w-6 rounded-full bg-emerald-400/80 blur-[1px] animate-[bounce_3.5s_infinite]" />
        <div className="absolute left-1/2 bottom-16 h-2 w-7 rounded-full bg-amber-300/90 blur-[1px] animate-[bounce_4s_infinite]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 min-h-[80vh] flex items-center">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Hero copy */}
          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.25em] text-accent/80 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Mobility prototype
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              Fluxora
              <span className="block text-accent">
                Smart Routing. Real-time Congestion.
              </span>
            </motion.h1>
            <motion.p
              className="text-slate-300 mb-6 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              A map-first experience that finds optimal routes, visualizes
              congestion live, and rewards low-impact travel. Reimagining how
              commuters navigate cities smarter.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center gap-4"
            >
              <motion.button
                onClick={onGetStarted}
                className="px-6 py-2.5 rounded-full bg-accent text-slate-950 font-medium shadow-lg shadow-accent/40 hover:shadow-accent/70 transition-transform hover:-translate-y-0.5 text-sm"
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
              <span className="text-xs text-slate-400">
                Scroll to explore routes, heatmaps, and live metrics.
              </span>
            </motion.div>
          </div>

          {/* Animated preview card (hero map mock) */}
          <motion.div
            className="h-60 md:h-72 rounded-3xl bg-slate-950/60 border border-slate-800/80 shadow-[0_0_60px_rgba(15,23,42,1)] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),_transparent_55%)]" />
            <div className="relative h-full w-full p-4 flex flex-col justify-between text-xs text-slate-200">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">Demo city graph</p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Live prototype
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-3 text-[11px] text-slate-300">
                  <span className="rounded-full bg-slate-900/80 px-2 py-1 border border-slate-700/60">
                    A → C → D
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2 py-1 border border-slate-700/60">
                    Congestion: 1.12
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2 py-1 border border-slate-700/60">
                    Reward: +10 pts
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-2 py-1 border border-slate-700/60">
                    Eco route
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Backed by Fluxora API</span>
                <span>Optimized with live congestion</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

