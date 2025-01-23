import { Box } from "@radix-ui/themes";
import { Notes, NOTES, Note } from "../lib/types";

export interface NotatorDropdownProps {
  onSelect?: (note: { action: "add" | "remove"; note: Note }) => void;
  selected?: Notes;
  index: number;
  noteCount?: string;
};

export function NotatorDropdown({ onSelect, selected, noteCount }: NotatorDropdownProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      {<div style={{ textAlign: "center" }}>{noteCount}</div>}
      {Object.keys(NOTES).map(note => {
        return <Box width={"35px"} height={"35px"} style={{ border: "1px solid", background: `${selected?.includes(note as Note) ? "white" : ""}` }} onClick={() => {
          onSelect?.({ action: selected?.includes(note as Note) ? "remove" : "add", note: note as Note })
        }}></Box>
      })}
    </div>
  );
}
