import type { MetronomeCursor } from "./cursor";

export interface MetronomeConfiguration {
  bpm: number;
  graceTime: number;
  started: boolean;
}

export interface MetronomeValues {
  metronome: MetronomeConfiguration & {
    ticks: number;
    cursor: MetronomeCursor;
  };
  setMetronomeConfig: (props: Partial<MetronomeConfiguration>) => void;
  toggle: () => void;
  next: () => void;
}

export { type MetronomeCursor };
