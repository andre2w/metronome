import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { calculateWidthAndPosition, createStaveNote } from "./helpers";
import { Beam, Formatter, Renderer, Stave, StemmableNote, Voice } from "vexflow";
import { Score, Tempo } from "~/shared/lib/score/score";
import { RESOLUTION, STAVE_HEIGHT, STAVE_WIDTH, Y_OFFSET } from "../constants";
import { Key } from "~/shared/lib/score/key-data";
import { Sticking } from "~/shared/lib/score/sticking";
import { MetronomeCursor } from "~/shared/lib/metronome";

export type BackgroundType = "light" | "dark";

export interface DrawProps {
  renderer: Renderer;
  sheetWidth: number;
  score: Score;
}

export interface PlayableNote {
  type: "note";
  position: { x: number; y: number; width: number; height: number };
  duration: Tempo;
}

export interface RestNote {
  type: "rest";
  duration: Tempo;
}

export type DrawnNote = PlayableNote | RestNote;

export interface ParsedNote {
  note: StemmableNote;
  shouldDraw: boolean;
  duration: Tempo;
}

export type ReducedStaveNote =
  | {
      type: "note";
      notes: Key[];
      withDot: boolean;
      duration: Tempo;
      sticking?: Sticking;
    }
  | { type: "rest"; duration: Tempo };

/**
 * Essa classe tem que ser divida em varias classes para o calculo das notas
 * VexflowPart - aonde pode adicionar notas
 * VexflowBar - aonde pode adicionar VexflowPart
 * VexflowScore - aonde pode adicionar Bars
 */
export class VexflowWrapper {
  #configuration: Configuration;
  #color: "black" | "white" = "black";
  #drawnNotes: DrawnNote[][][] = [];

  constructor(configuration: Configuration, background: BackgroundType) {
    this.#configuration = configuration;
    this.setBackground(background);
  }

  setBackground(background: BackgroundType) {
    this.#color = background === "light" ? "black" : "white";
  }

  setConfiguration(configuration: Configuration) {
    this.#configuration = configuration;
  }

  draw({ renderer, sheetWidth, score }: DrawProps) {
    this.#drawnNotes = [];
    const positions = calculateWidthAndPosition({
      sheetWidth: sheetWidth - 40,
      staveCount: score.bars.length,
      staveHeight: STAVE_HEIGHT,
      staveWidth: STAVE_WIDTH,
      startY: Y_OFFSET,
      startX: 20,
    });

    const height = positions.reduce(
      (prev, curr) => Math.max(prev, curr.y + STAVE_HEIGHT),
      Y_OFFSET,
    );

    renderer.resize(sheetWidth, height);
    const context = renderer.getContext();
    context.clear();

    context.fillStyle = this.#color;
    context.strokeStyle = this.#color;

    for (let barIndex = 0; barIndex < score.bars.length; barIndex++) {
      const position = positions[barIndex];
      if (!position) {
        throw new Error(`No position found for index: ${barIndex}`);
      }

      const stave = new Stave(position.x, position.y, position.width);
      stave.setContext(context);

      if (barIndex === 0) {
        stave.addClef("treble").addTimeSignature("4/4");
      }

      const bar = score.bars[barIndex];
      if (!bar) {
        throw new Error(`Invalid bars at index: ${barIndex}`);
      }
      this.#drawnNotes.push([]);

      const notes: ParsedNote[][] = [];
      const beams: Beam[] = [];
      for (let partIndex = 0; partIndex < bar.parts.length; partIndex++) {
        const part = bar.parts.at(barIndex);
        if (!part) {
          throw new Error(`Could not find part for index bar: ${barIndex}, part: ${partIndex}`);
        }
        let allowDot = part.tempo === "sixteens";

        if (part.notes.length === 0) {
          notes.push([
            {
              note: createStaveNote({
                background: this.#color,
                duration: "quarter",
                withDot: false,
                configuration: this.#configuration,
                bar: {
                  type: "note",
                  keys: [],
                },
              }),
              shouldDraw: false,
              duration: "quarter",
            },
          ]);
          continue;
        }

        let restCount = 0;
        const reducedNotes: ReducedStaveNote[] = [];
        for (const note of part.notes) {
          // In case the note doesn't have any key, it means that is a pause
          // so we increase the duration of the note.
          if (note.keys.length === 0) {
            const previous = reducedNotes.at(-1);
            if (!previous) {
              reducedNotes.push({
                type: "rest",
                duration: part.tempo,
              });
              continue;
            }
            let playableNote: Extract<ReducedStaveNote, { type: "note" }> | undefined;
            for (
              let reducedNotesIndex = reducedNotes.length - 1;
              reducedNotesIndex >= 0;
              reducedNotesIndex--
            ) {
              const n = reducedNotes[reducedNotesIndex];
              if (n && n.type === "note") {
                playableNote = n;
                break;
              }
            }
            if (!playableNote) {
              reducedNotes.push({
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
            restCount++;
          } else {
            reducedNotes.push({
              duration: part.tempo,
              notes: note.keys,
              sticking: note.sticking,
              withDot: false,
              type: "note",
            });
          }
        }

        const steammableNotes: ParsedNote[] = [];
        const beamNotes: StemmableNote[] = [];
        for (const reducedNote of reducedNotes) {
          const staveNote = createStaveNote({
            background: this.#color,
            bar: {
              type: "note",
              keys:
                reducedNote.type === "rest"
                  ? []
                  : reducedNote.notes.map((n) => ({ type: "key", ...n })),
              sticking: reducedNote.type === "note" ? reducedNote.sticking : undefined,
            },
            duration: reducedNote.duration,
            withDot: reducedNote.type === "note" ? reducedNote.withDot : false,
            configuration: this.#configuration,
          });
          steammableNotes.push({
            note: staveNote,
            shouldDraw: true,
            duration: reducedNote.duration,
          });
          if (reducedNote.type === "note" && reducedNote.notes.length > 0) {
            beamNotes.push(staveNote);
          }
        }
        notes.push(steammableNotes);

        if (beamNotes.length > 1) {
          beams.push(new Beam(beamNotes));
        }
      }

      const allNotes = notes.flatMap((note) => note.map((n) => n.note));

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

      this.#drawnNotes.push([]);
      for (let partIndex = 0; partIndex < notes.length; partIndex++) {
        const group: DrawnNote[] = [];
        this.#drawnNotes[barIndex]?.push(group);
        const noteGroup = notes.at(partIndex);
        if (!noteGroup) {
          throw new Error("This is wrong");
        }
        for (let noteIndex = 0; noteIndex < noteGroup.length; noteIndex++) {
          const note = notes[partIndex]?.[noteIndex];
          if (!note) {
            throw new Error("This is wrong");
          }

          const cursorNote = note.note;
          const modifierShift = cursorNote.getModifierContext()?.getLeftShift() ?? 0;
          group.push({
            type: "note",
            duration: note.duration,
            position: {
              x: cursorNote.getAbsoluteX() + -modifierShift,
              y: stave.getY(),
              width: Math.max(cursorNote.getWidth(), 15) + modifierShift,
              height: stave.getHeight(),
            },
          });
        }
      }
    }
  }

  getDrawnNotes() {
    return this.#drawnNotes;
  }

  drawnNoteAt(cursor: MetronomeCursor) {
    return this.#drawnNotes.at(cursor.bar)?.at(cursor.part).at(cursor.note);
  }
}
