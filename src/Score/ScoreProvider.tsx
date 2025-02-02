import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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

function useHash() {
  const [hash, setHashInternal] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    const hashListener = () => {
      const searchParams = new URLSearchParams(
        window.location.hash.substring(1),
      );
      setHashInternal(searchParams);
    };

    hashListener();

    window.addEventListener("hashchange", hashListener);

    return () => {
      window.removeEventListener("hashchange", hashListener);
    };
  }, []);

  const setHash = (hash: URLSearchParams) => {
    window.location.hash = hash.toString();
  };

  return { hash, setHash };
}

export function ScoreContextProvider({
  children,
  notes,
}: ScoreContextProviderProps) {
  const { hash, setHash } = useHash();
  const scoreText = hash.get("score");
  const initialScore = scoreText ? JSON.parse(scoreText) : [];
  const [score, setScore] = useState<Score>(initialScore);

  useEffect(() => {
    const scoreText = hash.get("score");
    const score = scoreText ? JSON.parse(scoreText) : [];
    setScore(score);
  }, [hash]);

  const addStave = () => {
    const newArr = Array.from<NotesWithSticking>({ length: notes }).fill({ notes: [] });
    const newHash = new URLSearchParams(hash);
    newHash.set("score", JSON.stringify([...score, newArr]));
    setHash(newHash);
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
    const newHash = new URLSearchParams(hash);
    newHash.set("score", JSON.stringify(newScore));
    setHash(newHash);
  };

  const removeStave: ScoreContextValue["removeStave"] = (staveIndex) => {
    const newScore = score.toSpliced(staveIndex, 1);
    const newHash = new URLSearchParams(hash);
    newHash.set("score", JSON.stringify(newScore));
    setHash(newHash);
  };

  const setSticking: ScoreContextValue["setSticking"] = ({ staveIndex, staveNoteIndex, sticking }) => {
    const newScore = [...score];
    newScore[staveIndex][staveNoteIndex] = sticking ? { ...newScore[staveIndex][staveNoteIndex], sticking } : { notes: newScore[staveIndex][staveNoteIndex].notes };
    const newHash = new URLSearchParams(hash);
    newHash.set("score", JSON.stringify(newScore));
    setHash(newHash);
  }

  return (
    <ScoreContext.Provider value={{ score, addStave, toggleNote, removeStave, setSticking }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScoreContext() {
  return useContext(ScoreContext);
}
