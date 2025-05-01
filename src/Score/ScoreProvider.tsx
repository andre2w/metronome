import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
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
  const [fullScore, setFullScore] = useImmer<FullScore & { id?: number }>(
    () => {
      const hash = getHash();
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
        ? JSON.parse(scoreText)
        : [createStave(configuration.signature)];
      const score = initialScore;
      const name = hash.get("name");

      return {
        ...configuration,
        name: name ?? "",
        score,
      };
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to update here
  useEffect(() => {
    const newHash = new URLSearchParams(getHash());
    newHash.set("score", JSON.stringify(fullScore.score));
    newHash.set("signature", String(fullScore.signature));
    newHash.set("bpm", String(fullScore.bpm));
    newHash.set("graceTime", String(fullScore.graceTime));
    if (fullScore.id) {
      newHash.set("id", String(fullScore.id));
    }
    if (fullScore.name) {
      newHash.set("name", fullScore.name);
    }
    setHash(newHash);
  }, [fullScore]);

  const addStave = useCallback(() => {
    setFullScore((fullScore) => {
      fullScore.score.push(createStave(fullScore.signature));
    });
  }, [setFullScore]);

  const toggleNote: ScoreContextValue["toggleNote"] = useCallback(
    ({ staveIndex, staveNoteIndex, note }) => {
      setFullScore((fullScore) => {
        const notesWithSticking = fullScore.score[staveIndex][staveNoteIndex];
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
    [setFullScore],
  );

  const removeStave: ScoreContextValue["removeStave"] = useCallback(
    (staveIndex) => {
      setFullScore((fullScore) => {
        fullScore.score.splice(staveIndex, 1);
        if (fullScore.score.length === 0) {
          fullScore.score.push(createStave(fullScore.signature));
        }
      });
    },
    [setFullScore],
  );

  const setSticking: ScoreContextValue["setSticking"] = useCallback(
    ({ staveIndex, staveNoteIndex, sticking }) => {
      setFullScore((fullScore) => {
        if (sticking !== null) {
          fullScore.score[staveIndex][staveNoteIndex].sticking = sticking;
        } else {
          fullScore.score[staveIndex][staveNoteIndex].sticking = undefined;
        }
      });
    },
    [setFullScore],
  );

  const loadScore: ScoreContextValue["loadScore"] = useCallback(
    (fullScore) => {
      setFullScore(fullScore);
    },
    [setFullScore],
  );

  const onChangeConfiguration: ScoreContextValue["onChangeConfiguration"] =
    useCallback(
      (configuration) => {
        setFullScore((fullScore) => {
          fullScore.bpm = configuration.bpm;
          fullScore.graceTime = configuration.graceTime;
          fullScore.signature = configuration.signature;

          if (
            fullScore.score.length === 1 &&
            fullScore.score[0].length !== fullScore.signature &&
            fullScore.score[0].every((n) => n.notes.length === 0)
          ) {
            fullScore.score = [createStave(configuration.signature)];
          }
        });
      },
      [setFullScore],
    );

  return (
    <ScoreContext.Provider
      value={{
        score: fullScore.score,
        addStave,
        toggleNote,
        removeStave,
        setSticking,
        loadScore,
        configuration: {
          bpm: fullScore.bpm,
          graceTime: fullScore.graceTime,
          signature: fullScore.signature,
          id: fullScore.id,
          name: fullScore.name,
        },
        onChangeConfiguration,
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
