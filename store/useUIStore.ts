import { create } from 'zustand';
import type { GeoPoint } from '@/lib/data/types';

interface UIStore {
  selectedEvent: GeoPoint | null;
  hoveredId: string | null;
  select(e: GeoPoint | null): void;
  hover(id: string | null): void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedEvent: null,
  hoveredId: null,
  select: (e) => set({ selectedEvent: e }),
  hover: (id) => set({ hoveredId: id }),
}));
