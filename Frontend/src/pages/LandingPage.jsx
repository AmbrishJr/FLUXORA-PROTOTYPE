import { motion } from "framer-motion";

function LandingPage({ onGetStarted }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Fluxora
            <span className="block text-accent">Smart Mobility in Real Time</span>
          </motion.h1>
          <motion.p
            className="text-slate-300 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Prototype dashboard that visualizes optimal routes, live congestion,
            and eco-friendly incentives. Built to wow hackathon judges in minutes.
          </motion.p>
          <motion.button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-full bg-accent text-slate-950 font-medium shadow-lg shadow-accent/40 hover:shadow-accent/60 transition-transform hover:-translate-y-0.5"
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.button>
        </div>
        <motion.div
          className="h-56 md:h-72 rounded-3xl bg-gradient-to-br from-accent/40 via-slate-900 to-slate-900 border border-slate-800 flex items-center justify-center text-sm text-slate-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Map-centric, congestion-aware routing preview goes here.
        </motion.div>
      </div>
    </section>
  );
}

export default LandingPage;

