import { createContext, ReactNode, useContext, useState } from "react";
import { Note, Notes, Score } from "../lib/types";

export interface ScoreContextValue {
    score: Score; 
    addStave: () => void; 
    toggleNote: (props: { staveIndex: number; staveNoteIndex: number; note: Note }) => void;
    removeStave: (staveIndex: number) => void;
}
const ScoreContext = createContext<ScoreContextValue>({ score: [], toggleNote: () => {}, addStave: () => {}, removeStave: () => {} });

export interface ScoreContextProviderProps {
    children: ReactNode;
    notes: number;
}

export function ScoreContextProvider({ children, notes }: ScoreContextProviderProps) {
    const [score, setScore] = useState<Score>([]);

    const addStave = () => {
        setScore((n) => {
            const newArr = Array.from<Notes>({
            length: notes,
            }).fill([]);
            return [...n, newArr];
        });
    }

    const toggleNote: ScoreContextValue["toggleNote"] = ({ staveIndex, staveNoteIndex, note }) => {
        setScore((oldScore) => {
            const newNote = oldScore[staveIndex][staveNoteIndex] ? [...oldScore[staveIndex][staveNoteIndex]] : [];
            const newNotation = [...oldScore[staveIndex]];
            const newScore = [...oldScore];
            newScore[staveIndex] = newNotation;
            newNotation[staveNoteIndex] = newNote;

            if (!newNote.includes(note)) {
                newNote.push(note);
            } else {
                const noteIndex = newNote.indexOf(note);
                if (noteIndex >= 0) {
                newNote.splice(noteIndex, 1);
                }
            }
            return newScore;
        })
    }

    const removeStave: ScoreContextValue["removeStave"] = (staveIndex) =>  {
        setScore(oldScore => oldScore.toSpliced(staveIndex, 1));
    }


    return <ScoreContext.Provider value={{ score, addStave, toggleNote, removeStave }}>
        {children}
    </ScoreContext.Provider>
}

export function useScoreContext() {
    return useContext(ScoreContext);
}