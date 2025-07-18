// This table contains how to change how the note is drawn
// https://github.com/0xfe/vexflow/blob/master/src/tables.ts#L151
// For vexflow is NOTE/
// https://github.com/0xfe/vexflow/blob/master/src/stavenote.ts#L407

// How to declare a note: https://github.com/0xfe/vexflow/blob/master/src/note.ts#L64
export const NOTES = {
  KICK: "f/4",
  SNARE: "c/5",
  GHOST_SNARE: "c/5",
  SNARE_X_STICK: "c/5/x2",
  ACCENTED_SNARE: "c/5",
  TOM_1: "e/5",
  TOM_2: "d/5",
  TOM_3: "a/4",
  HIGH_HAT: "g/5/x2",
  HIGH_HAT_OPEN: "g/5/x2",
  HIGH_HAT_PEDAL: "d/4/x2",
  RIDE: "f/5/x2",
  CRASH: "a/5/x2",
} as const;

export const sticking = ["L", "R", "R/L"] as const;
export type Sticking = (typeof sticking)[number];
export type Note = keyof typeof NOTES;

/**
 * Is one or more parts of the drum that must be played at a moment
 */
export type Notes = Note[];
export type NotesWithSticking = { notes: Notes; sticking?: Sticking };
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

/**
 * Is the capture of a note played through the midi interface
 */
export interface NotePlayed {
  /**
   * timestamp of when the note was played
   */
  timestamp: number;
  /**
   * note is the note number
   */
  note: Note;
}

export interface FullScore {
  score: Score;
  name: string;
  signature: number;
  bpm: number;
  graceTime: number;
}
