import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type GlobeStyle = 'realistic' | 'illustrated' | 'atlas' | 'glass' | 'sculpture';

interface GlobeStyleStore {
  style: GlobeStyle;
  setStyle(s: GlobeStyle): void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useGlobeStyleStore = create<GlobeStyleStore>()(
  persist(
    (set) => ({
      style: 'realistic',
      setStyle: (style) => set({ style }),
    }),
    {
      name: 'marble-style',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : noopStorage,
      ),
    },
  ),
);
