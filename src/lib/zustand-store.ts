import { create } from "zustand";
import {
  persist,
  type StateStorage,
  createJSONStorage,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  FullScore,
  Note,
  NotesWithSticking,
  Score,
  Sticking,
} from "./types";
import {
  defaultMetronomeConfiguration,
  type MetronomeConfigurationProps,
} from "../Metronome/configuration";

const queryParamsStorage: StateStorage = {
  getItem: (key): string => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    const value = urlSearchParams.get(key);
    return value ?? "";
  },
  setItem: (key, newValue): void => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    urlSearchParams.set(key, JSON.stringify(newValue));
    location.hash = urlSearchParams.toString();
  },
  removeItem: (key): void => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    urlSearchParams.delete(key);
    location.hash = urlSearchParams.toString();
  },
};

export interface ScoreContextValue {
  score: Score;
  addStave: () => void;
  toggleNote: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    note: Note;
  }) => void;
  removeStave: (staveIndex: number) => void;
  setSticking: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: FullScore & { id: number }) => void;
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
  onChangeConfiguration: (
    configuration: MetronomeConfigurationProps & { name?: string },
  ) => void;
  clear: () => void;
}

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
        storage: createJSONStorage(() => queryParamsStorage),
      },
    ),
  );
})();

function getInitialState() {
  const hash: { get: (key: string) => string | null } = new URLSearchParams(
    window.location.hash.substring(1),
  );

  const storedScore = hash.get("score");
  if (storedScore) {
    const value = JSON.parse(JSON.parse(storedScore));
    return value.state;
  }

  const signature = hash.get("signature");
  const bpm = hash.get("bpm");
  const graceTime = hash.get("graceTime");
  const id = hash.get("id");

  const configuration = {
    signature: signature
      ? Number(signature)
      : defaultMetronomeConfiguration.signature,
    bpm: bpm ? Number(bpm) : defaultMetronomeConfiguration.bpm,
    graceTime: graceTime
      ? Number(graceTime)
      : defaultMetronomeConfiguration.graceTime,
    id: id ? Number(id) : undefined,
  };
  const scoreText = hash.get("score");
  const initialScore: Score = scoreText
    ? typeof scoreText === "string"
      ? JSON.parse(scoreText)
      : scoreText
    : [createStave(configuration.signature)];
  const score = initialScore;
  const name = hash.get("name");

  return {
    ...configuration,
    name: name ?? "",
    score,
  };
}

export function createStave(notes: number) {
  return Array.from<NotesWithSticking>({ length: notes }).fill({
    notes: [],
  });
}
