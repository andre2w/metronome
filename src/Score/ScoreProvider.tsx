import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useImmer } from "use-immer";
import {
  type MetronomeConfigurationProps,
  defaultMetronomeConfiguration,
} from "../Metronome/configuration";
import { useURLHash } from "../hooks/useURLHash";
import type {
  FullScore,
  Note,
  NotesWithSticking,
  Score,
  Sticking,
} from "../lib/types";

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
  loadScore: (score: FullScore) => void;
  configuration: MetronomeConfigurationProps;
  onChangeConfiguration: (configuration: MetronomeConfigurationProps) => void;
}
const ScoreContext = createContext<ScoreContextValue>({
  score: [],
  toggleNote: () => {},
  addStave: () => {},
  removeStave: () => {},
  setSticking: () => {},
  loadScore: () => {},
  configuration: defaultMetronomeConfiguration,
  onChangeConfiguration: () => {},
});

export interface ScoreContextProviderProps {
  children: ReactNode;
}

export function ScoreContextProvider({ children }: ScoreContextProviderProps) {
  const { setHash, getHash } = useURLHash();
  const [configuration, setConfiguration] =
    useState<MetronomeConfigurationProps>(() => {
      const hash = getHash();
      const signature = hash.get("signature");
      const bpm = hash.get("bpm");
      const graceTime = hash.get("graceTime");

      return {
        signature: signature
          ? Number(signature)
          : defaultMetronomeConfiguration.signature,
        bpm: bpm ? Number(bpm) : defaultMetronomeConfiguration.bpm,
        graceTime: graceTime
          ? Number(graceTime)
          : defaultMetronomeConfiguration.graceTime,
      };
    });
  const [score, setScore] = useImmer<Score>(() => {
    const scoreText = getHash().get("score");
    const initialScore: Score = scoreText
      ? JSON.parse(scoreText)
      : [createStave(configuration.signature)];
    return initialScore;
  });

  if (
    score.length === 1 &&
    score[0].length !== configuration.signature &&
    score[0].every((n) => n.notes.length === 0)
  ) {
    setScore([createStave(configuration.signature)]);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to update here
  useEffect(() => {
    const newHash = new URLSearchParams(getHash());
    newHash.set("score", JSON.stringify(score));
    newHash.set("signature", String(configuration.signature));
    newHash.set("bpm", String(configuration.bpm));
    newHash.set("graceTime", String(configuration.graceTime));
    setHash(newHash);
  }, [score, configuration]);

  const addStave = useCallback(() => {
    setScore((score) => {
      score.push(createStave(configuration.signature));
    });
  }, [setScore, configuration.signature]);

  const toggleNote: ScoreContextValue["toggleNote"] = useCallback(
    ({ staveIndex, staveNoteIndex, note }) => {
      setScore((score) => {
        const notesWithSticking = score[staveIndex][staveNoteIndex];
        if (!notesWithSticking.notes.includes(note)) {
          notesWithSticking.notes.push(note);
        } else {
          const noteIndex = notesWithSticking.notes.indexOf(note);
          if (noteIndex >= 0) {
            notesWithSticking.notes.splice(noteIndex, 1);
          }
        }
      });
    },
    [setScore],
  );

  const removeStave: ScoreContextValue["removeStave"] = useCallback(
    (staveIndex) => {
      setScore((score) => {
        score.splice(staveIndex, 1);
        if (score.length === 0) {
          score.push(createStave(configuration.signature));
        }
      });
    },
    [setScore, configuration.signature],
  );

  const setSticking: ScoreContextValue["setSticking"] = useCallback(
    ({ staveIndex, staveNoteIndex, sticking }) => {
      setScore((score) => {
        if (sticking !== null) {
          score[staveIndex][staveNoteIndex].sticking = sticking;
        } else {
          score[staveIndex][staveNoteIndex].sticking = undefined;
        }
      });
    },
    [setScore],
  );

  const loadScore: ScoreContextValue["loadScore"] = useCallback(
    (fullScore) => {
      setScore(fullScore.score);
      if (fullScore.bpm && fullScore.graceTime && fullScore.signature) {
        setConfiguration({
          bpm: fullScore.bpm,
          graceTime: fullScore.graceTime,
          signature: fullScore.signature,
        });
      }
    },
    [setScore],
  );

  return (
    <ScoreContext.Provider
      value={{
        score,
        addStave,
        toggleNote,
        removeStave,
        setSticking,
        loadScore,
        configuration,
        onChangeConfiguration: setConfiguration,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export function useScoreContext() {
  return useContext(ScoreContext);
}

function createStave(notes: number) {
  return Array.from<NotesWithSticking>({ length: notes }).fill({
    notes: [],
  });
}
