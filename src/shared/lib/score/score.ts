import { Key } from "./key-data";
import { Sticking } from "./sticking";

/**
 * Is one or more parts of the drum that must be played at a moment
 */
export type Note = { type: "note"; keys: (Key & { type: "key" })[]; sticking?: Sticking };

export type Tempo = "quarter" | "eights" | "sixteens" | "eight_triplet" | "sixteen_triplet";

/**
 * A part can be a group of notes to be played. It can go from
 * 1 note in a 1/4 bar to 4 notes in a 1/16 bar.
 */
export interface Part {
  type: "part";
  tempo: Tempo;
  notes: Note[];
}

/**
 * It's 4 groups of notes - a bar can be 1/4 1/8 1/16
 */
export type Bar = { type: "bar"; parts: Part[] };

/**
 * The score is a list of bars that must be played
 */
export interface Score {
  type: "score";
  bars: Bar[];
  name: string;
  bpm: number;
  author: string;
}
