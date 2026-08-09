import { Part } from "~/shared/lib/score/score";
import { DrawnNote, ReducedStaveNote, RenderColor } from "./vexflow-wrapper";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import {
  Annotation,
  Beam,
  Dot,
  ModifierPosition,
  Parenthesis,
  Stave,
  StaveNote,
  Stem,
} from "vexflow";
import { REST_KEY } from "./constants";
import { MetronomeCursor } from "~/shared/lib/metronome";

export class VexflowPart {
  reducedNotes: ReducedStaveNote[] = [];
  #configuration: Configuration;
  #color: RenderColor;
  #staveNotes: (StaveNote | null)[] | null = null;
  #drawnNotes: DrawnNote[] | null = null;

  constructor(part: Part, configuration: Configuration, color: RenderColor) {
    this.#configuration = configuration;
    this.#color = color;

    let allowDot = part.tempo === "sixteens";

    if (part.notes.length === 0) {
      throw new Error("Part does not have any notes");
    }

    const isFullRest = part.notes.every((note) => note.keys.length === 0);
    if (isFullRest) {
      this.reducedNotes.push({
        duration: "quarter",
        keys: [],
        sticking: part.notes.at(0)?.sticking,
        withDot: false,
        type: "note",
      });
      for (let i = 1; i < part.notes.length; i++) {
        this.reducedNotes.push({
          type: "noop",
        });
      }
      return;
    }

    for (const note of part.notes) {
      if (note.keys.length > 0) {
        this.reducedNotes.push({
          duration: part.tempo,
          keys: note.keys.map((k) => ({ note: k.note, modifier: k.modifier })),
          sticking: note.sticking,
          withDot: false,
          type: "note",
        });
        continue;
      }
      // In case the note doesn't have any key, it means that is a pause
      // so we increase the duration of the note.
      const previous = this.getLastPlayableNote();
      if (!previous) {
        this.reducedNotes.push({
          type: "note",
          keys: [],
          withDot: false,
          sticking: note.sticking,
          duration: part.tempo,
        });
        continue;
      }

      if (previous.keys.length === 0 && previous.duration === "eights") {
        this.reducedNotes.push({
          type: "note",
          keys: [],
          withDot: false,
          sticking: note.sticking,
          duration: part.tempo,
        });
        continue;
      }

      if (previous.type === "note") {
        if (previous.duration === "sixteens") {
          previous.duration = "eights";
        } else if (previous.duration === "eights" && !previous.withDot && allowDot) {
          previous.withDot = true;
        } else if (previous.duration === "eights" && (previous.withDot || !allowDot)) {
          previous.withDot = false;
          previous.duration = "quarter";
        }
        this.reducedNotes.push({ type: "noop" });
      }
    }
  }

  draw() {
    this.#staveNotes = [];
    const beamNotes: StaveNote[] = [];
    for (const reducedNote of this.reducedNotes) {
      if (reducedNote.type === "noop") {
        this.#staveNotes.push(null);
        continue;
      }

      const staveNote = this.createStaveNote(reducedNote);
      this.#staveNotes.push(staveNote);
      if (reducedNote.keys.length > 0) {
        beamNotes.push(staveNote);
      }
    }

    let beam: Beam | undefined;
    if (beamNotes.length > 1) {
      beam = new Beam(beamNotes);
    }

    return { staveNotes: this.#staveNotes, beam };
  }

  updatePosition(stave: Stave) {
    if (this.#staveNotes === null) {
      throw new Error("Notes weren't drawn yet");
    }

    this.#drawnNotes = [];
    for (const staveNote of this.#staveNotes) {
      if (staveNote === null) {
        this.#drawnNotes.push({ type: "rest" });
        continue;
      }

      const modifierShift = staveNote.getModifierContext()?.getLeftShift() ?? 0;
      this.#drawnNotes.push({
        type: "note",
        x: staveNote.getAbsoluteX() + -modifierShift,
        y: stave.getY(),
        width: Math.max(staveNote.getWidth(), 15) + modifierShift,
        height: stave.getHeight(),
      });
    }
  }

  private getLastPlayableNote() {
    for (
      let reducedNotesIndex = this.reducedNotes.length - 1;
      reducedNotesIndex >= 0;
      reducedNotesIndex--
    ) {
      const n = this.reducedNotes[reducedNotesIndex];
      if (n && n.type === "note") {
        return n;
      }
    }
  }

  private createStaveNote(reducedStaveNote: Extract<ReducedStaveNote, { type: "note" }>) {
    if (reducedStaveNote.keys.length === 0) {
      return new StaveNote({
        keys: [REST_KEY],
        duration: `${this.parseTempo(reducedStaveNote.duration)}r`,
      });
    }

    const keys = reducedStaveNote.keys.map((key) => this.#configuration.getKeyValue(key));

    const staveNote = new StaveNote({ keys, duration: this.parseTempo(reducedStaveNote.duration) });
    const stem = new Stem({
      stemDirection: 1,
    });
    staveNote.setStem(stem);
    console.log("PART COLOR", this.#color);
    staveNote.setStyle({ strokeStyle: this.#color });

    for (const { note, modifier } of reducedStaveNote.keys) {
      if (!modifier) {
        continue;
      }
      const noteData = this.#configuration.getKeyData(note);

      if (!noteData) {
        throw new Error(`Could not find data for note: ${note}`);
      }

      if (noteData.modifiers) {
        const modifierData = noteData.modifiers[modifier];
        if (modifierData) {
          switch (modifierData.modifier.type) {
            case "annotation":
              staveNote.addModifier(new Annotation(modifierData.modifier.value));
              break;
            case "parenthesis":
              if (modifierData.modifier.which === "both") {
                staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
                staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
              }
              if (modifierData.modifier.which === "left") {
                staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
              }
              if (modifierData.modifier.which === "right") {
                staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
              }
              break;
            case "value-override":
              break;
          }
        }
      }
    }

    if (reducedStaveNote.sticking) {
      const annotation = new Annotation(reducedStaveNote.sticking);
      staveNote.addModifier(annotation);
    }
    if (reducedStaveNote.withDot) {
      Dot.buildAndAttach([staveNote]);
    }
    return staveNote;
  }

  private parseTempo(tempo: Part["tempo"]) {
    switch (tempo) {
      case "eights":
        return "8";
      case "quarter":
        return "4";
      case "sixteens":
        return "16";
      case "triplet":
        return "3";
    }
  }

  getNoteAt(cursor: Pick<MetronomeCursor, "note">) {
    if (this.#drawnNotes === null) {
      throw new Error("No notes were drawn");
    }

    return this.#drawnNotes.at(cursor.note);
  }
}
