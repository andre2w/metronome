import { Beam, type StemmableNote } from "vexflow";
import type { Note, NotesWithSticking, Sticking } from "../types";
import { createStaveNote } from "./helpers";

interface ReducedStaveNote {
  notes: Note[];
  withDot: boolean;
  duration: "4" | "8" | "16";
  sticking?: Sticking;
  hasCursor?: boolean;
}

/**
 * Duration 'q` for a quarter note
 */

export function parse({
  groups,
  background,
  baseDuration,
  cursorIndex,
}: {
  groups: (NotesWithSticking & { index: number })[][];
  background: "light" | "dark";
  baseDuration: "16" | "8" | "4";
  cursorIndex: number;
}) {
  const notes: { note: StemmableNote; hasCursor: boolean }[][] = [];
  const beams: Beam[] = [];
  const allowDot = baseDuration === "16";

  for (const group of groups) {
    const reducedNotes: ReducedStaveNote[] = [];
    for (const bar of group) {
      if (reducedNotes.length === 0) {
        reducedNotes.push({
          duration: baseDuration,
          notes: bar.notes,
          sticking: bar.sticking,
          withDot: false,
          hasCursor: bar.index === cursorIndex && bar.notes.length > 0,
        });
        continue;
      }

      if (bar.notes.length === 0) {
        const previous = reducedNotes.at(-1);
        if (!previous) {
          continue;
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
        reducedNotes.push({
          duration: baseDuration,
          notes: bar.notes,
          sticking: bar.sticking,
          withDot: false,
          hasCursor: bar.index === cursorIndex,
        });
      }
    }

    const steammableNotes: { note: StemmableNote; hasCursor: boolean }[] = [];
    const beamNotes: StemmableNote[] = [];
    for (const reducedNote of reducedNotes) {
      const staveNote = createStaveNote({
        background,
        bar: { notes: reducedNote.notes, sticking: reducedNote.sticking },
        duration: reducedNote.duration,
        withDot: reducedNote.withDot,
      });
      steammableNotes.push({
        note: staveNote,
        hasCursor: reducedNote.hasCursor ?? false,
      });
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
