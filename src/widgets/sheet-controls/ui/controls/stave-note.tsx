import { Text } from "@radix-ui/themes";
import { type NotesWithSticking } from "../../../../entities/score/model/types";
import "./stave-note.css";
import { StaveNoteBox } from "./stave-note-box";
import { BaseNote, NOTES } from "~/entities/score/model/notes";
import { Tile } from "./tile";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";

export interface StaveNoteProps {
  notesWithSticking: NotesWithSticking;
  staveIndex: number;
  barIndex: number;
  noteCount?: string;
  className?: string;
}

const stickingsLoop = [null, "L", "R", "R/L"] as const;

export function StaveNote({
  notesWithSticking,
  noteCount,
  className,
  staveIndex,
  barIndex,
}: StaveNoteProps) {
  const { notes: selectedNotes, sticking } = notesWithSticking;
  const setSticking = useScoreStore((state) => state.setSticking);
  const stickingIndex = Math.max(
    stickingsLoop.findIndex((s) => s === sticking),
    0,
  );
  const nextIndex = stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;

  return (
    <div className={`stave-note ${className ?? ""}`}>
      <Tile
        className="sticking"
        onClick={() => {
          setSticking({ staveIndex, staveNoteIndex: barIndex, sticking: stickingsLoop[nextIndex] });
        }}
      >
        <Text weight={sticking ? "bold" : "light"}>{sticking ?? noteCount}</Text>
      </Tile>
      {Object.keys(NOTES).map((note) => {
        const selectedNote = selectedNotes.find((n) => n.note === note);
        return (
          <StaveNoteBox
            key={note}
            isSelected={!!selectedNote}
            note={note as BaseNote}
            modifier={selectedNote?.modifier}
            index={{ staveIndex: staveIndex, barIndex }}
          />
        );
      })}
    </div>
  );
}
