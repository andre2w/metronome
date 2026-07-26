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

export function Stave({ bar, staveIndex, onRemoveStave }: StaveProps) {
  const tempoCounting = counting[bar.parts.length];
  if (!tempoCounting) {
    throw new Error(`No count for length: ${bar.parts.length}`);
  }

  const parts = bar.parts.flatMap((part, partIndex) => {
    return part.notes.map((note, noteIndex) => {
      const noteCount = tempoCounting[partIndex]?.[noteIndex];

      if (!noteCount) {
        throw new Error(
          `No counting for bar at ${JSON.stringify({ staveIndex, partIndex, note })}`,
        );
      }

      const withSpace = ["2", "3", "4"].includes(noteCount);

      return (
        <StaveNote
          partIndex={noteIndex}
          noteCount={noteCount}
          barIndex={partIndex}
          staveIndex={staveIndex}
          noteIndex={noteIndex}
          notesWithSticking={note}
          className={withSpace ? "with-space-left" : undefined}
        />
      );
    });
  });

  return (
    <div className="stave">
      <div className="stave-content">
        <Text>{staveIndex + 1}</Text>
        <Button onClick={onRemoveStave} variant="ghost">
          <Cross1Icon />
        </Button>
      </div>
      <div className="stave-notes">{parts}</div>
    </div>
  );
}
