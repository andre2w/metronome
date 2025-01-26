import { NotatorDropdown, NotatorDropdownProps } from "./NotatorDropdown";
import { Bar, NOTES } from "../lib/types";
import { Button, Text } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useScoreContext } from "../Score/ScoreProvider";
import { VexflowScore } from "../Score/VexflowScore";

// see updateSheetMusic in GrooveScribe for abc notation
// get32NoteArrayFromClickableUI
// Everything is 1/32 based, and it just keep spaces between
// x8 the number is the time waiting - Here is 8 because everything is 32 so waits for ticks
// Things inside square brackets are together like kick and snare at the same time
// notations together outside the square brackets with the number is how to define the ligature
// space means different groups of ligatures
export function SheetMaker() {
  const { addStave, score, toggleNote, removeStave } =useScoreContext();

  return (
    <>
    <VexflowScore score={score} />
    <div style={{ marginTop: "auto", marginBottom: "15px", overflow: "scroll"}}>
      <div style={{ display: "flex"}}>
        <button
          onClick={addStave}
        >
          Add new line
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
        <div style={{ alignSelf: "flex-end", position:"sticky", backgroundColor: "var(--accent-1)"}}>
          <div>---</div>
          {Object.keys(NOTES).map(note => <div style={{ height: "35px", boxSizing: "border-box", alignContent:"center", textAlign: "end", paddingRight: "5px" }}>{note}</div>)}
        </div>
        {score.map((bar, staveIndex) => {
          return <Stave bar={bar} index={staveIndex} 
            onSelectNote={(staveNoteIndex, note) => { toggleNote({ staveIndex, staveNoteIndex, note: note.note }) }}
            onRemoveStave={() => removeStave(staveIndex)}
          />
        })}
      </div>
    </div>
</>
  );
}

const counting: { [k: number]: string[] } = {
  4: ["1", "2", "3", "4"],
  8: ["1", "&", "2", "&", "3", "&", "4", "&"],
  16: ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"]
}

interface StaveProps {
  bar: Bar;
  index: number;
  onSelectNote: (barIndex: number, note: Parameters<NonNullable<NotatorDropdownProps["onSelect"]>>[0]) => void;
  onRemoveStave: () => void;
}
function Stave({ bar, index, onSelectNote, onRemoveStave }: StaveProps) {
  const tempoCounting = counting[bar.length];
  const notes = bar.map((notes, noteIndex) => {
    const noteCount = tempoCounting[noteIndex];
    return <NotatorDropdown
      noteCount={noteCount}
      index={index}
      selected={notes}
      onSelect={(note) => onSelectNote(noteIndex, note)}
    />
  });

  return <div style={{ paddingRight: "5px"}}>
      <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid wheat", marginBottom: "5px"}}>
        <Text>{index}</Text>
        <Button onClick={onRemoveStave} variant="ghost"><Cross1Icon /></Button>
      </div>
      <div style={{ display: "flex"}}>{notes}</div>
      </div>
}