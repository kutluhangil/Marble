import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Layer } from '@/lib/data/types';

interface LayersStore {
  active: Record<Layer, boolean>;
  /** Set false when the flights API reports no credentials. */
  flightAvailable: boolean;
  toggle(layer: Layer): void;
  setFlightAvailable(v: boolean): void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useLayersStore = create<LayersStore>()(
  persist(
    (set) => ({
      active: { quake: true, iss: true, weather: false, flight: false },
      flightAvailable: false,
      toggle: (layer) =>
        set((s) => ({ active: { ...s.active, [layer]: !s.active[layer] } })),
      setFlightAvailable: (v) => set({ flightAvailable: v }),
    }),
    {
      name: 'marble-layers',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage,
      ),
      // Only persist user layer choices, not runtime availability.
      partialize: (s) => ({ active: s.active }),
    },
  ),
);
