import { Dispatch, SetStateAction } from "react";
import { NotatorDropdown, NotatorDropdownProps } from "./NotatorDropdown";
import { Bar, NOTES, Notes, Score } from "../lib/types";
import { Button, Text } from "@radix-ui/themes";

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
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div style={{ alignSelf: "flex-end"}}>
          <div>---</div>
          {Object.keys(NOTES).map(note => <div style={{ height: "25px" }}>{note}</div>)}
        </div>
        {score.map((bar, scoreIndex) => {
          return <Stave bar={bar} index={scoreIndex} 
            onSelectNote={(barIndex, note) => {
              setScore((oldScore) => {
                const newNote = oldScore[scoreIndex][barIndex] ? [...oldScore[scoreIndex][barIndex]] : [];
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
              })}
            }

            onRemoveStave={() => {
              setScore(oldScore => oldScore.toSpliced(scoreIndex, 1))
            }}
          />
        })}
      </div>
    </div>
  );
}

interface StaveProps {
  bar: Bar;
  index: number;
  onSelectNote: (barIndex: number, note: Parameters<NonNullable<NotatorDropdownProps["onSelect"]>>[0]) => void;
  onRemoveStave: () => void;
}
function Stave({ bar, index, onSelectNote, onRemoveStave }: StaveProps) {
  const notes = bar.map((notes, noteIndex) => {
    return <NotatorDropdown
      index={index}
      selected={notes}
      onSelect={(note) => onSelectNote(noteIndex, note)}
    />
  });

  return <div style={{ paddingRight: "5px"}}>
      <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid wheat"}}>
        <Text>{index}</Text>
        <Button onClick={onRemoveStave}>X</Button>
      </div>
      <div style={{ display: "flex"}}>{notes}</div>
      </div>
}