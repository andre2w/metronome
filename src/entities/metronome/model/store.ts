import { StateCreator } from "zustand";
import { ScoreContextValue } from "~/entities/score/model/state/score-state";
import { Score } from "~/entities/score/model/types";

export interface MetronomeCursor {
  bar: number;
  part: number;
  note: number;
}

export interface MetronomeValues {
  bpm: number;
  graceTime: number;
  started: boolean;
  ticks: number;
  cursor: {
    bar: number;
    part: number;
    note: number;
  };
  toggle: () => void;
  next: () => void;
}

export const createMetronomeSlice: StateCreator<
  MetronomeValues & ScoreContextValue,
  [],
  [],
  MetronomeValues
> = (set) => ({
  bpm: 60,
  graceTime: 100,
  ticks: 0,
  cursor: {
    bar: 0,
    part: 0,
    note: 0,
  },
  started: false,
  toggle: () =>
    set((state) => {
      return {
        started: !state.started,
        ticks: 0,
        cursor: { bar: 0, part: 0, note: 0 },
      };
    }),
  next: () =>
    set((state) => {
      if (!state.started) {
        return state;
      }
      return {
        ticks: state.ticks + 1,
        cursor: moveCursorForward(state.score, state.cursor),
      };
    }),
});

function moveCursorForward(score: Score, cursor: MetronomeCursor): MetronomeCursor {
  const bar = score.bars.at(cursor.bar);
  const part = bar?.parts.at(cursor.part);

  if (!part || !bar) {
    throw new Error("Invalid cursor for score");
  }

  let nextNote = cursor.note + 1;
  let nextPart = cursor.part;
  if (nextNote >= part.notes.length) {
    nextNote = 0;
    nextPart++;
  }

  let nextBar = cursor.bar;
  if (nextPart >= (bar.parts.length ?? 0)) {
    nextPart = 0;
    nextBar++;
  }

  if (nextBar >= score.bars.length) {
    nextBar = 0;
  }

  return {
    bar: nextBar,
    part: nextPart,
    note: nextNote,
  };
}
