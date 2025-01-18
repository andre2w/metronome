import { Notes, NOTES, Note } from "../lib/types";

export interface NotatorDropdownProps {
  onSelect?: (note: { action: "add" | "remove"; note: Note }) => void;
  selected?: Notes;
  index: number;
};

export function NotatorDropdown({ onSelect, selected, index }: NotatorDropdownProps) {
  return (
    <details className="dropdown">
      <summary>{index}</summary>
      <ul>
        {Object.keys(NOTES).map(note => {
          return (
            <li key={note}>
              <label>
                <input
                  type="checkbox"
                  name={note}
                  checked={selected?.includes(note as Note) ?? false}
                  onChange={(e) =>
                    onSelect?.({
                      action: e.target.checked ? "add" : "remove",
                      note: note as Note,
                    })
                  }
                />
                {note}
              </label>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
