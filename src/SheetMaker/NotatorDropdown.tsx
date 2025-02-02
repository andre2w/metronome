import { Box } from "@radix-ui/themes";
import { type Notes, NOTES, type Note, type NotesWithSticking, type Sticking } from "../lib/types";

export interface NotatorDropdownProps {
  onSelect?: (note: Note) => void;
  onSetSticking?: (sticking: Sticking | null) => void;
  notesWithSticking: NotesWithSticking;
  index: number;
  noteCount?: string;
}

const stickingsLoop = [null, "L", "R", "R/L"] as const;

export function NotatorDropdown({
  onSelect,
  notesWithSticking,
  onSetSticking
}: NotatorDropdownProps) {
  const { notes: selectedNotes, sticking } = notesWithSticking;
  const stickingIndex = Math.max(stickingsLoop.findIndex(s => s === sticking), 0);
  const nextIndex = stickingIndex + 1 >= stickingsLoop.length ? 0 : stickingIndex + 1;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* <div style={{ textAlign: "center" }}>{noteCount}</div> */}
      <Box width={"35px"} height={"35px"} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => {
        onSetSticking?.(stickingsLoop[nextIndex]);
      }}>{sticking ?? "-"}</Box>
      {Object.keys(NOTES).map((note) => {
        const isSelected = selectedNotes.includes(note as Note);
        return (
          <Box
            key={note}
            width={"35px"}
            height={"35px"}
            style={{
              border: "1px solid var(--accent-9)",
              background: `${isSelected ? "var(--accent-9)" : ""}`,
            }}
            onClick={() => {
              onSelect?.(note as Note);
            }}
          />
        );
      })}
    </div>
  );
}
