import { calculateBeatTime } from "../lib/beat-time";

export interface BaseMetronomeConfigurationProps {
  beats: number;
  notes: number;
  graceTime: number;
}

export const defaultMetronomeConfiguration = {
  beats: 60,
  notes: 4,
  graceTime: calculateBeatTime(60, 4) - 2
};