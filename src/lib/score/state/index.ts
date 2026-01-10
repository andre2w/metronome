import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { conflictingNotesMap, type FullScore } from "../types";
import { createStave } from "./utils";
import { getInitialState, urlHashStorage } from "./storage";
import type { ScoreContextValue } from "./types";

export const useScoreStore = (() => {
  const initialState = getInitialState();
  return create<ScoreContextValue>()(
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
            const notesWithSticking = state.score[staveIndex][staveNoteIndex];

            if (!notesWithSticking.notes.includes(note)) {
              const conflictingNote = conflictingNotesMap[note];
              if (conflictingNote) {
                for (let i = 0; i < notesWithSticking.notes.length; i++) {
                  const conflictingNote = notesWithSticking.notes[i];
                  if (conflictingNote.includes(conflictingNote)) {
                    notesWithSticking.notes.splice(i, 1);
                  }
                }
              }

              notesWithSticking.notes.push(note);
            } else {
              const noteIndex = notesWithSticking.notes.indexOf(note);
              if (noteIndex >= 0) {
                notesWithSticking.notes.splice(noteIndex, 1);
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
            if (sticking !== null) {
              state.score[staveIndex][staveNoteIndex].sticking = sticking;
            } else {
              state.score[staveIndex][staveNoteIndex].sticking = undefined;
            }
          }),

        onChangeConfiguration: (configuration) =>
          set((state) => {
            state.configuration = configuration;

            if (
              state.score.length === 1 &&
              state.score[0].length !== state.configuration.signature &&
              state.score[0].every((n) => n.notes.length === 0)
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
        storage: createJSONStorage(() => urlHashStorage),
      },
    ),
  );
})();
