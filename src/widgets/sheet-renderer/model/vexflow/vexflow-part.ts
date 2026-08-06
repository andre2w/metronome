import { Part } from "~/shared/lib/score/score";
import { ReducedStaveNote } from "./vexflow-wrapper";

export class VexflowPart {
  reducedNotes: ReducedStaveNote[] = [];

  constructor(part: Part) {
    let allowDot = part.tempo === "sixteens";

    if (part.notes.length === 0) {
      throw new Error("Part does not have any notes");
    }

    for (const note of part.notes) {
      if (note.keys.length > 0) {
        this.reducedNotes.push({
          duration: part.tempo,
          notes: note.keys,
          sticking: note.sticking,
          withDot: false,
          type: "note",
        });
        continue;
      }
      // In case the note doesn't have any key, it means that is a pause
      // so we increase the duration of the note.
      const previous = this.reducedNotes.at(-1);
      if (!previous) {
        this.reducedNotes.push({
          type: "rest",
          duration: part.tempo,
        });
        continue;
      }

      const playableNote = this.getLastPlayableNote();

      if (!playableNote) {
        this.reducedNotes.push({
          type: "rest",
          duration: part.tempo,
        });
        continue;
      }

      if (playableNote.duration === "sixteens") {
        playableNote.duration = "eights";
      } else if (playableNote.duration === "eights" && !playableNote.withDot && allowDot) {
        playableNote.withDot = true;
      } else if (playableNote.duration === "eights" && (playableNote.withDot || !allowDot)) {
        playableNote.withDot = false;
        playableNote.duration = "quarter";
      }
    }
  }

  private getLastPlayableNote() {
    let playableNote: Extract<ReducedStaveNote, { type: "note" }> | undefined;
    for (
      let reducedNotesIndex = this.reducedNotes.length - 1;
      reducedNotesIndex >= 0;
      reducedNotesIndex--
    ) {
      const n = this.reducedNotes[reducedNotesIndex];
      if (n && n.type === "note") {
        playableNote = n;
        break;
      }
    }
    return playableNote;
  }
}
