import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { InitialState } from "./initial-state";
import { createStave, ScoreContextValue } from "./score-state";
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
            state.score.push(createStave(state.configuration.signature));
          }),

        toggleNote: ({ note, staveIndex, staveNoteIndex }) =>
          set((state) => {
            const notesWithSticking = state.score?.[staveIndex]?.[staveNoteIndex];

            if (!notesWithSticking) {
              throw new Error(`Cloudn't find Bar for index ${staveIndex} - ${staveNoteIndex}`);
            }

            if (!notesWithSticking.keys.some((n) => n.note === note.note)) {
              notesWithSticking.keys.push(note);
            } else {
              const noteIndex = notesWithSticking.keys.findIndex((n) => n.note === note.note);
              if (noteIndex >= 0) {
                /**
                 * Replace the existing note with one with the modifier
                 */
                const shouldReplace =
                  notesWithSticking.keys.at(noteIndex)?.modifier !== note.modifier;
                notesWithSticking.keys.splice(noteIndex, 1);
                if (shouldReplace) {
                  notesWithSticking.keys.push(note);
                }
              }
            }
          }),

        removeStave: (staveIndex) =>
          set((state) => {
            state.score.splice(staveIndex, 1);
            if (state.score.length === 0) {
              state.score.push(createStave(state.configuration.signature));
            }
          }),

        setSticking: ({ staveIndex, staveNoteIndex, sticking }) =>
          set((state) => {
            const notesWithSticking = state.score?.[staveIndex]?.[staveNoteIndex];

            if (!notesWithSticking) {
              throw new Error(`Cloudn't find Bar for index ${staveIndex} - ${staveNoteIndex}`);
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
              state.score.length === 1 &&
              state.score?.[0]?.length !== state.configuration.signature &&
              state.score?.[0]?.every((n) => n.keys.length === 0)
            ) {
              state.score = [createStave(state.configuration.signature)];
            }
          }),

        clear: () =>
          set((state) => {
            state.score = [createStave(state.configuration.signature)];
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
