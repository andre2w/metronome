import { StateCreator } from "zustand";
import { ScoreContextValue } from "~/entities/score/model/state/score-state";
import type { MetronomeValues, MetronomeCursor } from "~/shared/lib/metronome";
import { Score } from "~/shared/lib/score/score";

export const createMetronomeSlice: StateCreator<
  MetronomeValues & ScoreContextValue,
  [],
  [],
  MetronomeValues
> = (set) => ({
  metronome: {
    bpm: 60,
    graceTime: 100,
    ticks: 0,
    cursor: {
      bar: 0,
      part: 0,
      note: 0,
    },
    started: false,
  },
  toggle: () =>
    set((state) => {
      return {
        metronome: {
          ...state.metronome,
          started: !state.metronome.started,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      };
    }),
  next: () =>
    set((state) => {
      if (!state.metronome.started) {
        return { metronome: state.metronome };
      }
      return {
        metronome: {
          ...state.metronome,
          ticks: state.metronome.ticks + 1,
          cursor: moveCursorForward(state.score, state.metronome.cursor),
        },
      };
    }),

  setMetronomeConfig: (props) =>
    set((state) => {
      return {
        metronome: { ...state.metronome, props },
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
