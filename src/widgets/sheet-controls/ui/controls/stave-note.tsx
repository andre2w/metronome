import { Text } from "@radix-ui/themes";
import { type NotesWithSticking } from "../../../../entities/score/model/types";
import "./stave-note.css";
import { StaveNoteBox } from "./stave-note-box";
import { Tile } from "./tile";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";

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
  const configuration = useConfiguration();
  const { keys: selectedNotes, sticking } = notesWithSticking;
  const setSticking = useScoreStore((state) => state.setSticking);
  const stickingIndex = Math.max(
    stickingsLoop.findIndex((s) => s === sticking),
    0,
  );
  const nextIndex = stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;
  const nextSticking = stickingsLoop[nextIndex];
  if (!nextSticking) {
    throw new Error(`Invalid sticking at index ${nextIndex}`);
  }

  return (
    <div className={`stave-note ${className ?? ""}`}>
      <Tile
        className="sticking"
        onClick={() => {
          setSticking({ staveIndex, staveNoteIndex: barIndex, sticking: nextSticking });
        }}
      >
        <Text weight={sticking ? "bold" : "light"}>{sticking ?? noteCount}</Text>
      </Tile>
      {configuration.keys().map((key) => {
        const selectedNote = selectedNotes.find((n) => n.note === key.key);
        return (
          <StaveNoteBox
            isSelected={!!selectedNote}
            note={key.key}
            modifier={selectedNote?.modifier}
            index={{ staveIndex: staveIndex, barIndex }}
          />
        );
      })}
    </div>
  );
}
