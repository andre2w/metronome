import { calculateBeatTime } from "~/shared/lib/metronome/beat-time";

export const defaultMetronomeConfiguration = {
  bpm: 60,
  signature: 4,
  graceTime: calculateBeatTime(60, 4) - 2,
};
