import { create } from "zustand";
import { calculateBeatTime } from "./beat-time";

interface MetronomeConfigurationValues {
  /**
   *  Beats per minute
   */
  bpm: number;
  /**
   * The total time that you have to hit a note
   * So in case you set the graceTime to 200, you can hit a note
   * 100ms before or 100ms after the exact time that the tick happens
   */
  graceTime: number;
  /**
   * The number of MS between metronome ticks
   */
  beatTime: number;
  /**
   * This is the signature of the song but the metronome
   * can have a different one
   */
  signature: 4 | 8 | 16;
  onUpdate: (
    values: Partial<
      Pick<MetronomeConfigurationValues, "bpm" | "graceTime" | "signature">
    >,
  ) => void;
}

export const defaultMetronomeConfiguration = {
  bpm: 60,
  signature: 4,
  graceTime: calculateBeatTime(60, 4) - 2,
  beatTime: calculateBeatTime(60, 4),
} satisfies Pick<
  MetronomeConfigurationValues,
  "bpm" | "signature" | "graceTime" | "beatTime"
>;

export const useMetronomeStore = create<MetronomeConfigurationValues>()(
  (set) => ({
    ...defaultMetronomeConfiguration,
    onUpdate: (values) => {
      set((state) => {
        const bpm = values?.bpm ?? state.bpm;
        const signature = values.signature ?? state.signature;
        const beatTime = calculateBeatTime(bpm, signature);
        const graceTime = Math.min(
          beatTime - 2,
          values.graceTime ?? state.graceTime,
        );

        return { bpm, beatTime, graceTime, signature };
      });
    },
  }),
);
