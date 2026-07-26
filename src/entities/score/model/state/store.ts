import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { InitialState } from "./initial-state";
import { createBar, ScoreContextValue } from "./score-state";
import { FullScore } from "../types";
import { StateStorage } from "zustand/middleware";

export interface CreateScoreStoreProps {
  initialState: InitialState;
  storage: StateStorage;
}

export function createScoreStore({ initialState, storage }: CreateScoreStoreProps) {
  return createStore<ScoreContextValue>()(
    persist(
      immer((set) => ({
        score: initialState.score,
        configuration: initialState.configuration,
        addStave: () =>
          set((state) => {
            state.score.bars.push(createBar(state.configuration.signature));
          }),

        toggleNote: ({ key, barIndex, partIndex, noteIndex }) =>
          set((state) => {
            const noteInPart = state.score?.bars?.[barIndex]?.parts?.[partIndex]?.notes[noteIndex];

            if (!noteInPart) {
              state.score?.bars?.[barIndex]?.parts?.[partIndex]?.notes.push({
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

        removeStave: (staveIndex) =>
          set((state) => {
            state.score.bars.splice(staveIndex, 1);
            if (state.score.bars.length === 0) {
              state.score.bars.push(createBar(state.configuration.signature));
            }
          }),

        setSticking: ({ staveIndex: scoreIndex, staveNoteIndex: barIndex, partIndex, sticking }) =>
          set((state) => {
            const notesWithSticking =
              state.score?.bars[scoreIndex]?.parts[barIndex]?.notes[partIndex];

            if (!notesWithSticking) {
              throw new Error(
                `Cloudn't find Bar for index ${scoreIndex} - ${barIndex} - ${partIndex}`,
              );
            }

            if (sticking !== null) {
              notesWithSticking.sticking = sticking;
            } else {
              notesWithSticking.sticking = undefined;
            }
          }),

        onChangeConfiguration: (configuration) =>
          set((state) => {
            state.configuration = configuration;

            if (
              state.score.bars.length === 1 &&
              state.score?.bars[0]?.parts.length !== state.configuration.signature &&
              state.score?.bars[0]?.parts.every(
                (part) =>
                  part.notes.length === 0 || part.notes.every((note) => note.keys.length === 0),
              )
            ) {
              state.score = { type: "score", bars: [createBar(state.configuration.signature)] };
            }
          }),

        clear: () =>
          set((state) => {
            state.score = { type: "score", bars: [createBar(state.configuration.signature)] };
          }),

        loadScore: (score: FullScore & { id: number }) => {
          set((state) => {
            state.score = score.score;
            state.configuration = {
              bpm: score.bpm,
              graceTime: score.graceTime,
              signature: score.signature,
              name: score.name,
              id: score.id,
            };
          });
        },
      })),
      {
        name: "score",
        storage: createJSONStorage(() => storage),
      },
    ),
  );
}

export type ScoreStore = ReturnType<typeof createScoreStore>;
