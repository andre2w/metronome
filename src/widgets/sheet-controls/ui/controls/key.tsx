import { ContextMenu } from "@radix-ui/themes";
import type { ReactNode } from "react";
import "./key.css";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { Tile } from "./tile";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { KeyData } from "~/shared/lib/score/key-data";

export interface KeyProps {
  children?: ReactNode;
  className?: string;
  note: string;
  index?: {
    barIndex: number;
    partIndex: number;
    noteIndex: number;
  };
  isSelected: boolean;
  modifier?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Key({
  children,
  note,
  index,
  isSelected,
  modifier,
  onMouseEnter,
  onMouseLeave,
}: KeyProps) {
  const toggleNote = useScoreStore((state) => state.toggleNote);
  const configuration = useConfiguration();
  const noteData: KeyData | undefined = note ? configuration.getKeyData(note) : undefined;

  const onClick =
    index && note
      ? () => {
          toggleNote({
            noteIndex: index.noteIndex,
            key: { note: note, modifier },
            barIndex: index.barIndex,
            partIndex: index.partIndex,
          });
        }
      : undefined;

  const noteBox = (
    <Tile
      key={`${index?.barIndex ?? 0}#${index?.partIndex ?? 0}#${note}`}
      className="key"
      onClick={onClick}
      variant={isSelected ? "selected" : undefined}
      aria-label={note}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
                key={`Key#${index.barIndex}#${index.partIndex}#${index.noteIndex}#${modifier}`}
                onClick={() => {
                  toggleNote({
                    noteIndex: index.noteIndex,
                    key: { note, modifier: modifier },
                    barIndex: index.barIndex,
                    partIndex: index.partIndex,
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
