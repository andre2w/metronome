import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useImmer } from "use-immer";
import { useURLHash } from "../hooks/useURLHash";
import type { Note, NotesWithSticking, Score, Sticking } from "../lib/types";

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
  loadScore: (score: Score) => void;
}
const ScoreContext = createContext<ScoreContextValue>({
  score: [],
  toggleNote: () => {},
  addStave: () => {},
  removeStave: () => {},
  setSticking: () => {},
  loadScore: () => {},
});

export interface ScoreContextProviderProps {
  children: ReactNode;
  notes: number;
}

export function ScoreContextProvider({
  children,
  notes,
}: ScoreContextProviderProps) {
  const { setHash, getHash } = useURLHash();
  const [score, setScore] = useImmer<Score>(() => {
    const scoreText = getHash().get("score");
    const initialScore: Score = scoreText
      ? JSON.parse(scoreText)
      : [createStave(notes)];
    return initialScore;
  });

  if (score.length === 1 && score[0].length !== notes && score[0].every(n => n.notes.length === 0) ) {
    setScore([createStave(notes)]);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to update here
  useEffect(() => {
    const newHash = new URLSearchParams(getHash());
    newHash.set("score", JSON.stringify(score));
    setHash(newHash);
  }, [score]);

  const addStave = useCallback(() => {
    setScore((score) => {
      score.push(createStave(notes));
    });
  }, [setScore, notes]);

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
          score.push(createStave(notes));
        }
      });
    },
    [setScore, notes],
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
    (score) => {
      setScore(score);
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
