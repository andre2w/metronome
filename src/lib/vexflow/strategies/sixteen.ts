import { Beam, Dot, StaveNote, StemmableNote } from "vexflow";
import { NotesWithSticking } from "../../types";
import { createStaveNote } from "../helpers";
import { REST_KEY } from "../constants";

/**
 * Duration 'q` for a quarter note
 */

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

    let shouldSkipNext = false;
    let addPauseEnd = false;
    let barIndex = 0;
    while (barIndex < group.length) {
      const bar = group[barIndex];
      let withDot = false;
      let noteDuration = "16";
      let durationIndex = barIndex + 1;
      let skipCount = 1;
      while (durationIndex < group.length) {
        if (group[durationIndex].notes.length === 0) {
          if (noteDuration === "16") {
            noteDuration = "8";
          } else if (noteDuration === "8" && !withDot) {
            withDot = true;
          } else if (noteDuration === "8" && withDot) {
            noteDuration = "4";
            withDot = false;
          }
        } else {
          break;
        }
        durationIndex++;
        skipCount++;
      }

      let staveNote: StemmableNote;
      if (bar.notes.length === 0) {
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
        if (noteDuration !== "4") {
          beamNotes.push(staveNote);
        }
      }

      if (withDot) {
        Dot.buildAndAttach([staveNote]);
      }

      steammableNotes.push(staveNote);

      barIndex += skipCount;
    }

    notes.push(steammableNotes);
    if (beamNotes.length > 1) {
      beams.push(new Beam(beamNotes));
    }
  }

  return { notes, beams };
}
