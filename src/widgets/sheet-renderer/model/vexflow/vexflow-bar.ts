import { Bar } from "~/shared/lib/score/score";
import { VexflowPart } from "./vexflow-part";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { StavePosition } from "./helpers";
import { Beam, Formatter, RenderContext, Stave, StaveNote, Voice } from "vexflow";
import { RESOLUTION } from "../constants";
import { MetronomeCursor } from "~/shared/lib/metronome";
import { RenderColor } from "./vexflow-wrapper";

export class VexflowBar {
  #parts: VexflowPart[] = [];
  readonly position: StavePosition;
  readonly index: number;

  constructor(
    bar: Bar,
    configuration: Configuration,
    color: RenderColor,
    position: StavePosition,
    index: number,
  ) {
    this.position = position;
    this.index = index;
    for (const part of bar.parts) {
      this.#parts.push(new VexflowPart(part, configuration, color));
    }
  }

  draw(context: RenderContext) {
    const stave = new Stave(this.position.x, this.position.y, this.position.width);
    stave.setContext(context);

    if (this.index === 0) {
      stave.addClef("treble").addTimeSignature("4/4");
    }

    const allNotes: StaveNote[] = [];
    const beams: Beam[] = [];
    for (const part of this.#parts) {
      const { beam, staveNotes } = part.draw();
      allNotes.push(...staveNotes);
      if (beam) {
        beams.push(beam);
      }
    }

    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
      resolution: RESOLUTION,
    })
      .setMode(Voice.Mode.FULL)
      .addTickables(allNotes)
      .setContext(context)
      .setStave(stave);

    const formatter = new Formatter().joinVoices([voice]);
    formatter.formatToStave([voice], stave, {
      alignRests: false,
      stave,
      autoBeam: false,
    });

    stave.drawWithStyle();
    voice.drawWithStyle();
    for (const beam of beams) {
      beam.setContext(context).drawWithStyle();
    }

    for (const part of this.#parts) {
      part.updatePosition(stave);
    }
  }

  getNoteAt(cursor: Pick<MetronomeCursor, "note" | "part">) {
    return this.#parts.at(cursor.part)?.getNoteAt({ note: cursor.note });
  }
}
