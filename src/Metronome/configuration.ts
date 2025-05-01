import { calculateBeatTime } from "../lib/beat-time";

export interface MetronomeConfigurationProps {
  bpm: number;
  signature: number;
  graceTime: number;
}

export const defaultMetronomeConfiguration = {
  bpm: 60,
  signature: 4,
  graceTime: calculateBeatTime(60, 4) - 2,
};
