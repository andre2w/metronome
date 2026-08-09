import { Score, Tempo } from "~/shared/lib/score/score";
import { createBar, createPart, ScoreContextValue } from "./score-state";
import { StateCreator } from "zustand/vanilla";
import { MetronomeValues } from "~/shared/lib/metronome";

export type ScoreSlice = StateCreator<
  ScoreContextValue & MetronomeValues,
  [["zustand/persist", unknown], ["zustand/immer", never]],
  [],
  ScoreContextValue
>;

export const createScoreSlice: (initialScore?: Score) => ScoreSlice = (initialScore) => {
  return (set) => ({
    score: {
      author: initialScore?.author ?? "",
      bars: initialScore?.bars ?? [createBar("sixteens")],
      name: initialScore?.name ?? "",
      type: "score",
      bpm: initialScore?.bpm ?? 100,
    },
    addBar: () =>
      set((state) => {
        const previousTempo = state.score.bars.at(-1)?.parts.at(-1)?.tempo ?? "sixteens";
        state.score.bars.push(createBar(previousTempo));
      }),

    toggleNote: ({ key, barIndex, partIndex, noteIndex }) =>
      set((state) => {
        const noteInPart = state.score.bars?.[barIndex]?.parts?.[partIndex]?.notes[noteIndex];

        if (!noteInPart) {
          state.score.bars?.[barIndex]?.parts?.[partIndex]?.notes.push({
            type: "note",
            keys: [{ type: "key", ...key }],
          });
          return;
        }

        if (!noteInPart.keys.some((n) => n.note === key.note)) {
          noteInPart.keys.push({ type: "key", ...key });
        } else {
          const noteIndex = noteInPart.keys.findIndex((n) => n.note === key.note);
          if (noteIndex >= 0) {
            /**
             * Replace the existing note with one with the modifier
             */
            const shouldReplace = noteInPart.keys.at(noteIndex)?.modifier !== key.modifier;
            noteInPart.keys.splice(noteIndex, 1);
            if (shouldReplace) {
              noteInPart.keys.push({ type: "key", ...key });
            }
          }
        }
      }),

    removeBar: (barIndex) =>
      set((state) => {
        state.score.bars.splice(barIndex, 1);
        const previousTempo = state.score.bars.at(-1)?.parts.at(-1)?.tempo ?? "sixteens";
        if (state.score.bars.length === 0) {
          state.score.bars.push(createBar(previousTempo));
        }
      }),

    setSticking: ({ barIndex, noteIndex, partIndex, sticking }) =>
      set((state) => {
        const notesWithSticking = state.score.bars[barIndex]?.parts[partIndex]?.notes[noteIndex];

        if (!notesWithSticking) {
          throw new Error(`Cloudn't find Bar for index ${barIndex} - ${partIndex} - ${noteIndex}`);
        }

        if (sticking !== null) {
          notesWithSticking.sticking = sticking;
        } else {
          notesWithSticking.sticking = undefined;
        }
      }),

    clear: () =>
      set((state) => {
        const previousTempo = state.score.bars.at(-1)?.parts.at(-1)?.tempo ?? "sixteens";
        const cleanBar = createBar(previousTempo);
        state.score = {
          bars: [cleanBar],
          type: "score",
          name: "",
          author: "",
          bpm: 100,
        };
      }),

    updateMetadata: (props) => {
      set((state) => {
        return {
          score: {
            ...state.score,
            ...props,
          },
        };
      });
    },

    loadScore: (score: Score) => {
      set(() => {
        return {
          score: score,
        };
      });
    },

    changeTempo: ({
      index,
      tempo,
    }: {
      index: { barIndex: number; partIndex: number };
      tempo: Tempo;
    }) => {
      set((state) => {
        const part = state.score.bars.at(index.barIndex)?.parts.at(index.partIndex)!;
        const updatedPart = createPart(tempo);
        part.tempo = tempo;
        part.notes = updatedPart.notes;
      });
    },
  });
};
