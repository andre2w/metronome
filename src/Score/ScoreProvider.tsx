import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
}
const ScoreContext = createContext<ScoreContextValue>({
  score: [],
  toggleNote: () => {},
  addStave: () => {},
  removeStave: () => {},
  setSticking: () => {},
});

export interface ScoreContextProviderProps {
  children: ReactNode;
  notes: number;
}


export function ScoreContextProvider({
  children,
  notes,
}: ScoreContextProviderProps) {
  const { hash, setHash } = useURLHash();
  const scoreText = hash.get("score");
  const initialScore = scoreText ? JSON.parse(scoreText) : [];
  const [score, setScore] = useState<Score>(initialScore);

  useEffect(() => {
    const scoreText = hash.get("score");
    const score = scoreText ? JSON.parse(scoreText) : [];
    setScore(score);
  }, [hash]);

  const updateScore = (score: Score) => {
    setScore(score);
    const newHash = new URLSearchParams(hash);
    newHash.set("score", JSON.stringify(score));
    setHash(newHash);
  };

  const addStave = () => {
    const newArr = Array.from<NotesWithSticking>({ length: notes }).fill({
      notes: [],
    });
    updateScore([...score, newArr]);
  };

  const toggleNote: ScoreContextValue["toggleNote"] = ({
    staveIndex,
    staveNoteIndex,
    note,
  }) => {
    const newScore = [...score];
    const notesWithSticking = newScore[staveIndex][staveNoteIndex];

    if (!notesWithSticking.notes.includes(note)) {
      notesWithSticking.notes.push(note);
    } else {
      const noteIndex = notesWithSticking.notes.indexOf(note);
      if (noteIndex >= 0) {
        notesWithSticking.notes.splice(noteIndex, 1);
      }
    }
    updateScore(newScore);
  };

  const removeStave: ScoreContextValue["removeStave"] = (staveIndex) => {
    const newScore = score.toSpliced(staveIndex, 1);
    updateScore(newScore);
  };

  const setSticking: ScoreContextValue["setSticking"] = ({
    staveIndex,
    staveNoteIndex,
    sticking,
  }) => {
    const newScore = [...score];
    newScore[staveIndex][staveNoteIndex] = sticking
      ? { ...newScore[staveIndex][staveNoteIndex], sticking }
      : { notes: newScore[staveIndex][staveNoteIndex].notes };
    updateScore(newScore);
  };

  return (
    <ScoreContext.Provider
      value={{ score, addStave, toggleNote, removeStave, setSticking }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export function useScoreContext() {
  return useContext(ScoreContext);
}
