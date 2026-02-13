import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import usePointsStore from '../stores/usePointsStore';

/**
 * PointsIcon - Floating points icon with notification badge
 * - Shows total points and notification dot for new points
 * - Opens points details modal when clicked
 */
function PointsIcon() {
  const { totalPoints, hasNewPoints, markPointsAsViewed } = usePointsStore();
  const [showModal, setShowModal] = useState(false);

  const handleIconClick = () => {
    console.log('Points icon clicked, current points:', totalPoints);
    setShowModal(true);
    markPointsAsViewed();
  };

  // Debug: Always show the icon for testing
  useEffect(() => {
    console.log('PointsIcon mounted, totalPoints:', totalPoints, 'hasNewPoints:', hasNewPoints);
  }, [totalPoints, hasNewPoints]);

  return (
    <>
      {/* Floating Points Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleIconClick}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-300">
            <span className="text-amber-900 text-xl font-bold">🪙</span>
          </div>
          
          {/* Notification Badge */}
          <AnimatePresence>
            {hasNewPoints && (
              <motion.div
                key="notification-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              >
                <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Points Counter */}
          <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded-full border border-amber-400">
            {totalPoints}
          </div>
        </div>
      </motion.div>

      {/* Points Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="points-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200">Your Points</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center py-6">
                <div className="text-6xl mb-2">🪙</div>
                <div className="text-3xl font-bold text-amber-400 mb-2">
                  {totalPoints}
                </div>
                <div className="text-sm text-slate-400">
                  Total Points Earned
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Earn points for choosing low-congestion routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Get bonus points for eco-friendly choices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Points unlock rewards and achievements</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-accent text-slate-950 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PointsIcon;
