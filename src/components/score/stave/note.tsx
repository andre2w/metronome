import { Text } from "@radix-ui/themes";
import {
  NOTES,
  type Note,
  type NotesWithSticking,
  type Sticking,
} from "../../../lib/score/types";
import "./note.css";
import { NoteBox } from "./note-box";

export interface NoteProps {
  onSelect: (note: Note) => void;
  onSetSticking: (sticking: Sticking | null) => void;
  notesWithSticking: NotesWithSticking;
  index: number;
  noteCount?: string;
  className?: string;
}

const stickingsLoop = [null, "L", "R", "R/L"] as const;

export function Note({
  onSelect,
  notesWithSticking,
  onSetSticking,
  noteCount,
  className,
}: NoteProps) {
  const { notes: selectedNotes, sticking } = notesWithSticking;
  const stickingIndex = Math.max(
    stickingsLoop.findIndex((s) => s === sticking),
    0,
  );
  const nextIndex =
    stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;
  return (
    <div className={`stave-note ${className ?? ""}`}>
      <NoteBox
        squared
        className="sticking"
        onClick={() => {
          onSetSticking?.(stickingsLoop[nextIndex]);
        }}
      >
        <Text weight={sticking ? "bold" : "light"}>
          {sticking ?? noteCount}
        </Text>
      </NoteBox>
      {Object.keys(NOTES).map((note) => {
        const isSelected = selectedNotes.includes(note as Note);
        return (
          <NoteBox
            key={note}
            squared
            className={`note ${isSelected ? "note-selected" : ""}`}
            onClick={() => {
              onSelect?.(note as Note);
            }}
          />
        );
      })}
    </div>
  );
}
