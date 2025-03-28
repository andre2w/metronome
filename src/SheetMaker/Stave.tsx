import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import type { Bar } from "../lib/types";
import { StaveNote, type StaveNoteProps } from "./StaveNote";
import "./Stave.css";

const counting: { [k: number]: string[] } = {
  4: ["1", "2", "3", "4"],
  8: ["1", "&", "2", "&", "3", "&", "4", "&"],
  16: [
    "1",
    "e",
    "&",
    "a",
    "2",
    "e",
    "&",
    "a",
    "3",
    "e",
    "&",
    "a",
    "4",
    "e",
    "&",
    "a",
  ],
};

export interface StaveProps {
  bar: Bar;
  index: number;
  onSelectNote: (
    barIndex: number,
    note: Parameters<StaveNoteProps["onSelect"]>[0],
  ) => void;
  onRemoveStave: () => void;
  onSetStickings: (
    barIndex: number,
    sticking: Parameters<StaveNoteProps["onSetSticking"]>[0],
  ) => void;
}

export function Stave({
  bar,
  index,
  onSelectNote,
  onRemoveStave,
  onSetStickings,
}: StaveProps) {
  const tempoCounting = counting[bar.length];
  const notes = bar.map((notesWithSticking, noteIndex) => {
    const noteCount = tempoCounting[noteIndex];
    return (
      // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
      <StaveNote
        noteCount={noteCount}
        index={index}
        notesWithSticking={notesWithSticking}
        onSelect={(note) => onSelectNote(noteIndex, note)}
        onSetSticking={(sticking) => onSetStickings(noteIndex, sticking)}
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
