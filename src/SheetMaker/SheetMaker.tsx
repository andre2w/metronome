import { Dispatch, SetStateAction } from "react";
import { NotatorDropdown } from "./NotatorDropdown";
import { Notes, Score } from "../lib/types";

export interface SheetMakerProps {
  notes: number;
  score: Score;
  setScore: Dispatch<SetStateAction<Score>>;
}
// see updateSheetMusic in GrooveScribe for abc notation
// get32NoteArrayFromClickableUI
// Everything is 1/32 based, and it just keep spaces between
// x8 the number is the time waiting - Here is 8 because everything is 32 so waits for ticks
// Things inside square brackets are together like kick and snare at the same time
// notations together outside the square brackets with the number is how to define the ligature
// space means different groups of ligatures
export function SheetMaker({ notes, score, setScore }: SheetMakerProps) {

  return (
    <div style={{ marginTop: "5px"}}>
      <div style={{ display: "flex"}}>
        <button
          onClick={() => {
            setScore((n) => {
              const newArr = Array.from<Notes>({
                length: notes,
              });
              return [...n, newArr];
            });
          }}
        >
          Add new line
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
        {score.map((bars, scoreIndex) => {
          return (<div style={{ display: "flex", width: "100%"}}>
            {bars.map((notes, barIndex) => (
              <NotatorDropdown
                index={barIndex}
                selected={notes}
                onSelect={(note) => {
                  setScore((oldScore) => {
                    const newNote = oldScore[scoreIndex][barIndex]
                      ? [...oldScore[scoreIndex][barIndex]]
                      : [];
                    const newNotation = [...oldScore[scoreIndex]];
                    const newNotations = [...oldScore];
                    newNotations[scoreIndex] = newNotation;
                    newNotation[barIndex] = newNote;
                    if (note.action === "add" && !newNote.includes(note.note)) {
                      newNote.push(note.note);
                    } else {
                      const noteIndex = newNote.indexOf(note.note);
                      if (noteIndex >= 0) {
                        newNote.splice(noteIndex, 1);
                      }
                    }
                    return newNotations;
                  });
                }}
              />
          ))}</div>);
        })}
      </div>
    </div>
  );
}
