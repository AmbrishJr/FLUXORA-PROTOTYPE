import { create } from 'zustand';

const usePointsStore = create((set, get) => ({
  totalPoints: 0,
  hasNewPoints: false,
  
  addPoints: (points) => {
    set((state) => ({
      totalPoints: state.totalPoints + points,
      hasNewPoints: true
    }));
  },
  
  markPointsAsViewed: () => {
    set({ hasNewPoints: false });
  },
  
  resetPoints: () => {
    set({ totalPoints: 0, hasNewPoints: false });
  }
}));

export default usePointsStore;
