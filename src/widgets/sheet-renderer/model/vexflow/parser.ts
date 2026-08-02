import { Beam, type StemmableNote } from "vexflow";
import { createStaveNote } from "./helpers";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { Key } from "~/shared/lib/score/key-data";
import { Bar, Part } from "~/shared/lib/score/score";
import { Sticking } from "~/shared/lib/score/sticking";

interface ReducedStaveNote {
  notes: Key[];
  withDot: boolean;
  duration: Part["tempo"];
  sticking?: Sticking;
  hasCursor?: boolean;
}

/**
 * Duration 'q` for a quarter note
 */

export function parse({
  bar,
  background,
  cursorIndex,
  configuration,
}: {
  bar: Bar;
  background: "light" | "dark";
  cursorIndex: number;
  configuration: Configuration;
}) {
  const notes: { note: StemmableNote; hasCursor: boolean }[][] = [];
  const beams: Beam[] = [];

  for (const part of bar.parts) {
    const reducedNotes: ReducedStaveNote[] = [];
    let allowDot = part.tempo === "sixteens";

    if (part.notes.length === 0) {
      notes.push([
        {
          note: createStaveNote({
            background,
            duration: "quarter",
            withDot: false,
            configuration,
            bar: {
              type: "note",
              keys: [],
            },
          }),
          hasCursor: false,
        },
      ]);
      continue;
    }

    for (const [index, note] of part.notes.entries()) {
      // In case the note doesn't have any key, it means that is a pause
      // so we increase the duration of the note.
      if (note.keys.length === 0) {
        const previous = reducedNotes.at(-1);
        if (!previous) {
          reducedNotes.push({
            duration: part.tempo,
            notes: note.keys,
            sticking: note.sticking,
            withDot: false,
            hasCursor: index === cursorIndex,
          });
          continue;
        }
        if (previous.duration === "sixteens") {
          previous.duration = "eights";
        } else if (previous.duration === "eights" && !previous.withDot && allowDot) {
          previous.withDot = true;
        } else if (previous.duration === "eights" && (previous.withDot || !allowDot)) {
          previous.withDot = false;
          previous.duration = "quarter";
        }
      } else {
        reducedNotes.push({
          duration: part.tempo,
          notes: note.keys,
          sticking: note.sticking,
          withDot: false,
          hasCursor: index === cursorIndex,
        });
      }
    }

    const steammableNotes: { note: StemmableNote; hasCursor: boolean }[] = [];
    const beamNotes: StemmableNote[] = [];
    for (const reducedNote of reducedNotes) {
      const staveNote = createStaveNote({
        background,
        bar: {
          type: "note",
          keys: reducedNote.notes.map((n) => ({ type: "key", ...n })),
          sticking: reducedNote.sticking,
        },
        duration: reducedNote.duration,
        withDot: reducedNote.withDot,
        configuration,
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
