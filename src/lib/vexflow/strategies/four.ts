import { StaveNote, StemmableNote } from "vexflow";
import { NotesWithSticking } from "../../types";
import { createStaveNote } from "../helpers";
import { REST_KEY } from "../constants";

/**
 * Duration 'q` for a quarter note
 */
const DURATION = "qr";

export function parse({
  groups,
  background,
}: {
  groups: NotesWithSticking[][];
  background: "light" | "dark";
}) {
  const notes: StemmableNote[][] = [];

  for (const group of groups) {
    const steammableNotes: StemmableNote[] = [];

    for (const bar of group) {
      let staveNote: StemmableNote;
      if (bar.notes.length === 0) {
        staveNote = new StaveNote({ keys: [REST_KEY], duration: DURATION });
      } else {
        staveNote = createStaveNote({
          background,
          bar,
          duration: DURATION,
        });
      }
      steammableNotes.push(staveNote);
    }

    notes.push(steammableNotes);
  }

  return { notes };
}
