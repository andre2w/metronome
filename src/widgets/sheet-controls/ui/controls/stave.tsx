import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import type { Bar } from "../../../../entities/score/model/types";
import "./stave.css";
import { StaveNote } from "./stave-note";
import { counting } from "../../model/constants";

export interface StaveProps {
  bar: Bar;
  staveIndex: number;
  onRemoveStave: () => void;
  className?: string;
}

export function Stave({ bar, staveIndex: index, onRemoveStave }: StaveProps) {
  const tempoCounting = counting[bar.length];
  if (!tempoCounting) {
    throw new Error(`No count for length: ${bar.length}`);
  }
  const notes = bar.map((notesWithSticking, barIndex) => {
    const noteCount = tempoCounting[barIndex];

    if (!noteCount) {
      throw new Error(`No counting for bar at ${barIndex}`);
    }

    const withSpace = ["2", "3", "4"].includes(noteCount);
    return (
      <StaveNote
        noteCount={noteCount}
        barIndex={barIndex}
        staveIndex={index}
        notesWithSticking={notesWithSticking}
        className={withSpace ? "with-space-left" : undefined}
      />
    );
  });

  return (
    <div className="stave">
      <div className="stave-content">
        <Text>{index + 1}</Text>
        <Button onClick={onRemoveStave} variant="ghost">
          <Cross1Icon />
        </Button>
      </div>
      <div className="stave-notes">{notes}</div>
    </div>
  );
}
