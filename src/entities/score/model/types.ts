// This table contains how to change how the note is drawn
// https://github.com/0xfe/vexflow/blob/master/src/tables.ts#L151
// For vexflow is NOTE/
// https://github.com/0xfe/vexflow/blob/master/src/stavenote.ts#L407

import { Key } from "~/shared/lib/score/key-data";

// How to declare a note: https://github.com/0xfe/vexflow/blob/master/src/note.ts#L64
export const sticking = ["L", "R", "R/L"] as const;
export type Sticking = (typeof sticking)[number];

/**
 * Is one or more parts of the drum that must be played at a moment
 */

export type Note = { type: "note"; keys: (Key & { type: "key" })[]; sticking?: Sticking };

export type Tempo = "quarter" | "eights" | "sixteens" | "triplet";

/**
 * A part can be a group of notes to be played. It can go from
 * 1 note in a 1/4 bar to 4 notes in a 1/16 bar.
 */
export interface Part {
  type: "part";
  tempo: "quarter" | "eights" | "sixteens" | "triplet";
  notes: Note[];
}

/**
 * It's 4 groups of notes - a bar can be 1/4 1/8 1/16
 */
export type Bar = { type: "bar"; parts: Part[] };

/**
 * The score is a list of bars that must be played
 */
export type Score = { type: "score"; bars: Bar[] };

/**
 * A tick is one tick of the metronome when the note
 * is supposed to be played
 */
export type Ticks = number[];

export interface FullScore {
  score: Score;
  name: string;
  signature: number;
  bpm: number;
  graceTime: number;
}
