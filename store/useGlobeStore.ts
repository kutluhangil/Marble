import { create } from 'zustand';

interface GlobeStore {
  /** Whether the world group is spinning. */
  autoRotate: boolean;
  /** True while the user is actively dragging the camera. */
  dragging: boolean;
  setDragging(v: boolean): void;
  setAutoRotate(v: boolean): void;
}

export const useGlobeStore = create<GlobeStore>((set) => ({
  autoRotate: true,
  dragging: false,
  setDragging: (v) => set({ dragging: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
}));
