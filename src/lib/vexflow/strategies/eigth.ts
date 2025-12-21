import { Beam, StaveNote, StemmableNote } from "vexflow";
import { NotesWithSticking } from "../../types";
import { createStaveNote } from "../helpers";
import { REST_KEY } from "../constants";

export function parse({
  groups,
  background,
}: {
  groups: NotesWithSticking[][];
  background: "light" | "dark";
}) {
  const notes: StemmableNote[][] = [];
  const beams: Beam[] = [];

  for (const group of groups) {
    const steammableNotes: StemmableNote[] = [];
    const beamNotes: StemmableNote[] = [];
    for (const [barIndex, bar] of group.entries()) {
      const next = group.at(barIndex + 1);
      const noteDuration = next && next.notes.length === 0 ? "q" : "8";

      let staveNote: StemmableNote;
      if (barIndex === 0 && bar.notes.length === 0) {
        staveNote = new StaveNote({
          keys: [REST_KEY],
          duration: `${noteDuration}r`,
        });
      } else {
        staveNote = createStaveNote({
          bar,
          background,
          duration: noteDuration,
        });
        if (noteDuration === "8") {
          beamNotes.push(staveNote);
        }
      }

      steammableNotes.push(staveNote);
      if (staveNote.getDuration() === "q") {
        break;
      }
    }

    notes.push(steammableNotes);
    if (beamNotes.length > 1) {
      beams.push(new Beam(beamNotes));
    }
  }

  return {
    notes,
    beams: beams,
  };
}
