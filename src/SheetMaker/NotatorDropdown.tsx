import { Box, Checkbox } from "@radix-ui/themes";
import { Notes, NOTES, Note } from "../lib/types";

export interface NotatorDropdownProps {
  onSelect?: (note: { action: "add" | "remove"; note: Note }) => void;
  selected?: Notes;
  index: number;
};

export function NotatorDropdown({ onSelect, selected, index }: NotatorDropdownProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      {Object.keys(NOTES).map(note => {
        return <Box width={"25px"} height={"25px"} style={{ border: "1px solid", background: `${selected?.includes(note as Note) ? "white" : ""}`, margin: "2px" }} onClick={() => {
          onSelect?.({ action: selected?.includes(note as Note) ? "remove" : "add", note: note as Note })
        }}></Box>
      })}
    </div>
  );
}
