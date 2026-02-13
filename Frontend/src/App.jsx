import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";
import HeatmapPage from "./pages/HeatmapPage";
import DashboardPage from "./pages/DashboardPage";
import Footer from "./components/Footer";

function App() {
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);
  const dashboardRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Unified Header System */}
      <header className="relative z-30">
        {/* ROW 1 - Branding Bar */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-center space-y-1">
            {/* Main Title */}
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
              NEXGEN HACKATHON PROTOTYPE — FLUXORA
            </h1>
            
            {/* Subheading */}
            <p className="text-sm text-slate-300 opacity-80">
              AI-Powered Urban Flow Balancer
            </p>
            
            {/* Team Section */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-400 opacity-60">Team Talos</span>
              <span className="text-xs text-slate-500 opacity-60">·</span>
              <span className="text-xs text-slate-400 opacity-60">Ambrish S · Chairmadurai P · MuthuKumaran M · Darshini R</span>
            </div>
          </div>
        </div>

        {/* ROW 2 - Navigation Bar */}
        <div className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/90" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-6xl mx-auto px-6 py-3">
            <nav className="flex items-center justify-between">
              {/* Left - Logo */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-2 text-lg font-semibold tracking-tight group"
              >
                <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_#3B82F6] group-hover:shadow-[0_0_25px_#3B82F6] transition-shadow" />
                <span className="text-slate-200 group-hover:text-accent transition-colors">Fluxora</span>
              </button>
              
              {/* Right - Navigation Links */}
              <div className="flex items-center gap-6 text-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(mapRef)}
                  className="text-slate-300 hover:text-accent transition-colors relative group"
                >
                  Map
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(heatmapRef)}
                  className="text-slate-300 hover:text-accent transition-colors relative group"
                >
                  Heatmap
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(dashboardRef)}
                  className="text-slate-300 hover:text-accent transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-slate-300 hover:text-accent transition-colors relative group"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-8 space-y-24">
        <AnimatePresence>
          <Landing onGetStarted={() => scrollToSection(mapRef)} />
          <section ref={mapRef}>
            <MapPage />
          </section>
          <section ref={heatmapRef}>
            <HeatmapPage />
          </section>
          <section ref={dashboardRef}>
            <DashboardPage />
          </section>
        </AnimatePresence>
      </main>

      {/* About / footer acts as the About section target */}
      <section ref={aboutRef}>
        <Footer />
      </section>
    </div>
  );
}

export default App;

