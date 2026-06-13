import { ContextMenu } from "@radix-ui/themes";
import type { ReactNode } from "react";
import "./stave-note-box.css";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { Tile } from "./tile";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { KeyData } from "~/shared/lib/score/key-data";

export interface StaveNoteBoxProps {
  children?: ReactNode;
  className?: string;
  note: string;
  index?: {
    staveIndex: number;
    barIndex: number;
  };
  isSelected: boolean;
  modifier?: string;
}
export function StaveNoteBox({ children, note, index, isSelected, modifier }: StaveNoteBoxProps) {
  const toggleNote = useScoreStore((state) => state.toggleNote);
  const configuration = useConfiguration();
  const noteData: KeyData | undefined = note ? configuration.getKeyData(note) : undefined;
  console.log("NoteData", noteData, note);

  const onClick =
    index && note
      ? () => {
          toggleNote({
            note: { note: note, modifier },
            staveIndex: index.staveIndex,
            staveNoteIndex: index.barIndex,
          });
        }
      : undefined;

  const noteBox = (
    <Tile
      key={`${index?.staveIndex ?? 0}#${index?.barIndex ?? 0}#${note}`}
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
