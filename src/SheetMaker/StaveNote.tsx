import { Box, Text } from "@radix-ui/themes";
import {
  NOTES,
  type Note,
  type NotesWithSticking,
  type Sticking,
} from "../lib/types";
import "./StaveNote.css";

export interface StaveNoteProps {
  onSelect: (note: Note) => void;
  onSetSticking: (sticking: Sticking | null) => void;
  notesWithSticking: NotesWithSticking;
  index: number;
  noteCount?: string;
}

const stickingsLoop = [null, "L", "R", "R/L"] as const;

export function StaveNote({
  onSelect,
  notesWithSticking,
  onSetSticking,
  noteCount
}: StaveNoteProps) {
  const { notes: selectedNotes, sticking } = notesWithSticking;
  const stickingIndex = Math.max(
    stickingsLoop.findIndex((s) => s === sticking),
    0,
  );
  const nextIndex =
    stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;
  return (
    <div className="stave-note">
      <Box
        width={"35px"} height={"35px"} className="sticking" 
        onClick={() => {
          onSetSticking?.(stickingsLoop[nextIndex]);
        }}
      >
        <Text weight={sticking ? "bold" : "light"}>{sticking ?? noteCount}</Text>
      </Box>
      {Object.keys(NOTES).map((note) => {
        const isSelected = selectedNotes.includes(note as Note);
        return (
          <Box
            key={note}
            width={"35px"}
            height={"35px"}
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