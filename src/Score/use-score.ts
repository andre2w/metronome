import { useState } from "react";
import { Note, Notes, Score } from "../lib/types";

export interface UseScoreProps {
    notes: number;
}
export function useScore({ notes }: UseScoreProps) {
  const [score, setScore] = useState<Score>([]);

  const addStave = () => {
    setScore((n) => {
            const newArr = Array.from<Notes>({
            length: notes,
            }).fill([]);
            return [...n, newArr];
        });
    }

    const toggleNote = ({ staveIndex, staveNoteIndex, note }: { staveIndex: number; staveNoteIndex: number; note: Note }) => {
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

    return { addStave, score, toggleNote };
}