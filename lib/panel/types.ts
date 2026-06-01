import type { Layer } from '@/lib/data/types';

export interface PanelStat {
  label: string;
  value: string;
}

/** Normalized model that drives the universal info panel for any layer. */
export interface PanelModel {
  layer: Layer;
  color: string;
  title: string;
  subtitle?: string;
  stats: PanelStat[];
  description?: string;
  facts?: PanelStat[];
  status: 'live' | 'idle' | 'unavailable';
  sourceName: string;
  sourceUrl: string;
}
