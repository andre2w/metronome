import { ContextMenu } from "@radix-ui/themes";
import type { Key, ReactNode } from "react";
import "./stave-note-box.css";
import { type BaseNote, NoteData, NOTES } from "~/entities/score/model/notes";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { Tile } from "./tile";

export interface StaveNoteBoxProps {
  children?: ReactNode;
  key?: Key;
  className?: string;
  note?: BaseNote;
  index?: {
    staveIndex: number;
    barIndex: number;
  };
  isSelected: boolean;
  modifier?: string;
}
export function StaveNoteBox({
  children,
  key,
  note,
  index,
  isSelected,
  modifier,
}: StaveNoteBoxProps) {
  const toggleNote = useScoreStore((state) => state.toggleNote);
  const noteData: NoteData | undefined = note ? NOTES[note] : undefined;

  const onClick =
    index && note
      ? () => {
          toggleNote({
            note: { note, modifier },
            staveIndex: index.staveIndex,
            staveNoteIndex: index.barIndex,
          });
        }
      : undefined;

  const noteBox = (
    <Tile
      key={key}
      className="stave-note-box"
      onClick={onClick}
      variant={isSelected ? "selected" : undefined}
    >
      {children}
    </Tile>
  );

  if (index && note && noteData && noteData.modifiers) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>{noteBox}</ContextMenu.Trigger>
        <ContextMenu.Content>
          {Object.entries(noteData.modifiers).map(([modifier, modifierData]) => {
            return (
              <ContextMenu.Item
                onClick={() => {
                  toggleNote({
                    note: { note, modifier: modifier },
                    staveIndex: index.staveIndex,
                    staveNoteIndex: index.barIndex,
                  });
                }}
              >
                {modifierData.label}
              </ContextMenu.Item>
            );
          })}
        </ContextMenu.Content>
      </ContextMenu.Root>
    );
  }

  return noteBox;
}
