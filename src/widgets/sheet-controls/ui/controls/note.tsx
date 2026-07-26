import { Text } from "@radix-ui/themes";
import { type Note } from "../../../../entities/score/model/types";
import "./note.css";
import { Key } from "./key";
import { Tile } from "./tile";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";

export interface NoteProps {
  notesWithSticking: Note;
  noteCount?: string;
  className?: string;
  index: {
    barIndex: number;
    partIndex: number;
    noteIndex: number;
  };
}

const stickingsLoop = [null, "L", "R", "R/L"] as const;

export function Note({ notesWithSticking, noteCount, className, index }: NoteProps) {
  const configuration = useConfiguration();
  const { keys: selectedNotes, sticking } = notesWithSticking;
  const setSticking = useScoreStore((state) => state.setSticking);
  const stickingIndex = Math.max(
    stickingsLoop.findIndex((s) => s === sticking),
    0,
  );
  const nextIndex = stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;
  const nextSticking = stickingsLoop[nextIndex];
  if (typeof nextSticking === "undefined") {
    throw new Error(`Invalid sticking at index ${nextIndex}`);
  }

  return (
    <div className={`stave-note ${className ?? ""}`}>
      <Tile
        className="sticking"
        onClick={() => {
          setSticking({
            ...index,
            sticking: nextSticking,
          });
        }}
      >
        <Text weight={sticking ? "bold" : "light"}>{sticking ?? noteCount}</Text>
      </Tile>
      {configuration.keys().map((key) => {
        const selectedNote = selectedNotes.find((n) => n.note === key.key);
        return (
          <Key
            isSelected={!!selectedNote}
            note={key.key}
            modifier={selectedNote?.modifier}
            index={index}
          />
        );
      })}
    </div>
  );
}
