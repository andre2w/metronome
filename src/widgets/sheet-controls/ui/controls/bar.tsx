import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import type { Bar } from "../../../../entities/score/model/types";
import "./bar.css";
import { Note } from "./note";
import { counting } from "../../model/constants";

export interface StaveProps {
  bar: Bar;
  barIndex: number;
  onRemoveStave: () => void;
  className?: string;
}

export function Bar({ bar, barIndex, onRemoveStave }: StaveProps) {
  const tempoCounting = counting[bar.parts.length];
  if (!tempoCounting) {
    throw new Error(`No count for length: ${bar.parts.length}`);
  }

  const parts = bar.parts.flatMap((part, partIndex) => {
    return part.notes.map((note, noteIndex) => {
      const noteCount = tempoCounting[partIndex]?.[noteIndex];

      if (!noteCount) {
        throw new Error(
          `No counting for bar at ${JSON.stringify({ staveIndex: barIndex, partIndex, note })}`,
        );
      }

      const withSpace = ["2", "3", "4"].includes(noteCount);

      return (
        <Note
          noteCount={noteCount}
          notesWithSticking={note}
          index={{ barIndex, partIndex, noteIndex }}
          className={withSpace ? "with-space-left" : undefined}
        />
      );
    });
  });

  return (
    <div className="stave">
      <div className="stave-content">
        <Text>{barIndex + 1}</Text>
        <Button onClick={onRemoveStave} variant="ghost">
          <Cross1Icon />
        </Button>
      </div>
      <div className="stave-notes">{parts}</div>
    </div>
  );
}
