import { Modifier } from "~/shared/lib/score/modifier";

export interface KeyData {
  value: string;
  label: string;
  modifiers?: Record<string, { label: string; modifier: Modifier }>;
}

export const KEYS = {
  KICK: { label: "Kick", value: "f/4" },
  SNARE: {
    label: "Snare",
    value: "c/5",
    modifiers: {
      GHOST_SNARE: {
        label: "(Ghosted)",
        modifier: { type: "parenthesis", which: "both" },
      },
      SNARE_X_STICK: {
        label: "cross-stick",
        modifier: { type: "value-override", value: "c/5/x2" },
      },
      ACCENTED_SNARE: {
        label: "(Accented)",
        modifier: { type: "annotation", value: ">" },
      },
    },
  },
  TOM_1: { label: "Tom 1", value: "e/5" },
  TOM_2: { label: "Tom 2", value: "d/5" },
  TOM_3: { label: "Tom 3", value: "a/4" },
  HIGH_HAT: {
    label: "High Hat",
    value: "g/5/x2",
    modifiers: {
      HIGH_HAT_OPEN: {
        label: "(open)",
        modifier: { type: "annotation", value: "O" },
      },
    },
  },
  HIGH_HAT_PEDAL: { label: "High Hat Pedal", value: "d/4/x2" },
  RIDE: { label: "Ride", value: "f/5/x2" },
  CRASH: { label: "Crash", value: "a/5/x2" },
} as const satisfies Record<string, KeyData>;

export type BaseKeys = keyof typeof KEYS;
