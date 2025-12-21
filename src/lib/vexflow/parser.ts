import { Beam, StemmableNote } from "vexflow";
import { Note, NotesWithSticking, Sticking } from "../types";
import { createStaveNote } from "./helpers";

interface ReducedStaveNote {
  notes: Note[];
  withDot: boolean;
  duration: "4" | "8" | "16";
  sticking?: Sticking;
}

/**
 * Duration 'q` for a quarter note
 */

export function parse({
  groups,
  background,
  baseDuration,
}: {
  groups: NotesWithSticking[][];
  background: "light" | "dark";
  baseDuration: "16" | "8" | "4";
}) {
  const notes: StemmableNote[][] = [];
  const beams: Beam[] = [];
  const allowDot = baseDuration === "16";

  for (const group of groups) {
    const reducedNotes = group.reduce<ReducedStaveNote[]>((acc, curr) => {
      if (acc.length === 0) {
        acc.push({
          duration: baseDuration,
          notes: curr.notes,
          sticking: curr.sticking,
          withDot: false,
        });
        return acc;
      }

      if (curr.notes.length === 0) {
        const previous = acc.at(-1);
        if (!previous) {
          return acc;
        }
        if (previous.duration === "16") {
          previous.duration = "8";
        } else if (previous.duration === "8" && !previous.withDot && allowDot) {
          previous.withDot = true;
        } else if (
          previous.duration === "8" &&
          (previous.withDot || !allowDot)
        ) {
          previous.withDot = false;
          previous.duration = "4";
        }
      } else {
        acc.push({
          duration: baseDuration,
          notes: curr.notes,
          sticking: curr.sticking,
          withDot: false,
        });
      }

      return acc;
    }, []);

    const steammableNotes: StemmableNote[] = [];
    const beamNotes: StemmableNote[] = [];
    for (const reducedNote of reducedNotes) {
      const staveNote = createStaveNote({
        background,
        bar: { notes: reducedNote.notes, sticking: reducedNote.sticking },
        duration: reducedNote.duration,
        withDot: reducedNote.withDot,
      });
      steammableNotes.push(staveNote);
      if (reducedNote.notes.length > 0) {
        beamNotes.push(staveNote);
      }
    }
    notes.push(steammableNotes);
    if (beamNotes.length > 1) {
      beams.push(new Beam(beamNotes));
    }
  }

  return { notes, beams };
}
