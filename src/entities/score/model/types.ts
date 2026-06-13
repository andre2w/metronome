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
export type Keys = Key[];
export type NotesWithSticking = { keys: Keys; sticking?: Sticking };
/**
 * It's 4 groups of notes - a bar can be 1/4 1/8 1/16
 */
export type Bar = NotesWithSticking[];

/**
 * The score is a list of bars that must be played
 */
export type Score = Bar[];

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
