import { Box } from "@radix-ui/themes";
import { type Notes, NOTES, type Note } from "../lib/types";

export interface NotatorDropdownProps {
  onSelect?: (note: { action: "add" | "remove"; note: Note }) => void;
  selected?: Notes;
  index: number;
  noteCount?: string;
}

export function NotatorDropdown({
  onSelect,
  selected,
  noteCount,
}: NotatorDropdownProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {<div style={{ textAlign: "center" }}>{noteCount}</div>}
      {Object.keys(NOTES).map((note) => {
        return (
          <Box
            key={note}
            width={"35px"}
            height={"35px"}
            style={{
              border: "1px solid var(--accent-9)",
              background: `${selected?.includes(note as Note) ? "var(--accent-9)" : ""}`,
            }}
            onClick={() => {
              onSelect?.({
                action: selected?.includes(note as Note) ? "remove" : "add",
                note: note as Note,
              });
            }}
          />
        );
      })}
    </div>
  );
}
