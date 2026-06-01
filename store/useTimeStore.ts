import { create } from 'zustand';

interface TimeStore {
  /** Milliseconds offset from real time; drives the simulated sun position. */
  offsetMs: number;
  setOffset(ms: number): void;
  reset(): void;
}

export const useTimeStore = create<TimeStore>((set) => ({
  offsetMs: 0,
  setOffset: (offsetMs) => set({ offsetMs }),
  reset: () => set({ offsetMs: 0 }),
}));

/** Current simulated date (real time shifted by the scrubber offset). */
export const simDate = (): Date =>
  new Date(Date.now() + useTimeStore.getState().offsetMs);
