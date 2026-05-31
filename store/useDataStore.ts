import { create } from 'zustand';
import type { GeoPoint, Layer } from '@/lib/data/types';

interface DataStore {
  events: Record<Layer, GeoPoint[]>;
  setEvents(layer: Layer, points: GeoPoint[]): void;
}

export const useDataStore = create<DataStore>((set) => ({
  events: { quake: [], iss: [], weather: [], flight: [] },
  setEvents: (layer, points) =>
    set((s) => ({ events: { ...s.events, [layer]: points } })),
}));
