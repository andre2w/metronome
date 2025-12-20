import {
  Annotation,
  Beam,
  Dot,
  Formatter,
  Fraction,
  GhostNote,
  ModifierPosition,
  Parenthesis,
  type Renderer,
  Stave,
  StaveNote,
  Stem,
  type StemmableNote,
  Voice,
} from "vexflow";
import { NOTES, NotesWithSticking, type Score } from "../lib/types";
import { calculateWidthAndPosition } from "./helpers";

const Y_OFFSET = 50;
const STAVE_HEIGHT = 150;
const STAVE_WIDTH = 300;
const RESOLUTION = 16384;

export interface DrawScoreProps {
  renderer: Renderer;
  sheetWidth: number;
  score: Score;
  index: number;
  colors: {
    background: "light" | "dark";
    accent?: string;
  };
}

export function drawScore({
  renderer,
  sheetWidth,
  score,
  index,
  colors: { accent, background },
}: DrawScoreProps) {
  const positions = calculateWidthAndPosition({
    sheetWidth: sheetWidth - 40,
    staveCount: score.length,
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

  if (background === "light") {
    context.fillStyle = "black";
    context.strokeStyle = "black";
  } else {
    context.fillStyle = "white";
    context.strokeStyle = "white";
  }

  if (!score.length) {
    const stave = new Stave(0, 0, 0);
    stave.setContext(context).draw();
    Formatter.FormatAndDraw(context, stave, [], {
      autoBeam: true,
      alignRests: true,
    });
    return;
  }

  let currentIndex = 0;

  for (let i = 0; i < score.length; i++) {
    const position = positions[i];
    const stave = new Stave(position.x, position.y, position.width);
    stave.setContext(context);

    if (i === 0) {
      stave.addClef("treble").addTimeSignature("4/4");
    }

    const bars = score[i];

    const notes: StemmableNote[][] = [];
    const beamsExisting: Beam[] = [];
    const duration = String(bars.length);

    const size = duration === "4" ? 1 : duration === "8" ? 2 : 4;
    console.log("Duration", { duration, size, bars });
    let groupingIndex = 0;
    const groups: NotesWithSticking[][] = [];
    while (groupingIndex < bars.length) {
      groups.push([]);
      for (let i = 1; i <= size; i++) {
        console.log({ groupingIndex, b: bars[groupingIndex] });
        groups.at(-1)?.push(bars[groupingIndex]);
        groupingIndex++;
      }
    }

    for (const [index, group] of groups.entries()) {
      const steammableNotes: StemmableNote[] = [];
      let shouldSkipNext = false;
      let addPauses = false;
      for (const [barIndex, bar] of group.entries()) {
        if (shouldSkipNext) {
          shouldSkipNext = false;
          continue;
        }
        let staveNote: StemmableNote;
        if (bar.notes.length === 0) {
          if (barIndex === 2) {
            const prev = group.at(1);
            const next = group.at(3);
            if (
              prev &&
              prev.notes.length === 0 &&
              next &&
              next.notes.length > 0
            ) {
              addPauses = true;
              continue;
            }
          }
          staveNote = new GhostNote({ duration });
        } else {
          const keys = bar.notes.map((note) => NOTES[note]);
          let noteDuration = duration;
          if (group.length === 4) {
            if (barIndex === 0 || barIndex == 2) {
              const next = group.at(barIndex + 1);
              if (next && next?.notes.length === 0) {
                noteDuration = "8";
                shouldSkipNext = true;
              }
            }
            if (addPauses) {
              noteDuration = "8";
              shouldSkipNext = true;
            }
          }
          console.log({ noteDuration });
          staveNote = new StaveNote({ keys, duration: noteDuration });
          const stem = new Stem({
            stemDirection: 1,
          });
          staveNote.setStem(stem);
          if (background === "dark") {
            staveNote.setStyle({ strokeStyle: "white" });
          }

          if (bar.notes.includes("HIGH_HAT_OPEN")) {
            const annotation = new Annotation("O");

            staveNote.addModifier(annotation);
          }
          if (bar.notes.includes("GHOST_SNARE")) {
            staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
            staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
          }
          if (bar.notes.includes("ACCENTED_SNARE")) {
            const annotation = new Annotation(">");

            staveNote.addModifier(annotation);
          }
        }

        steammableNotes.push(staveNote);
      }

      notes.push(steammableNotes);
      const beamNotes = steammableNotes.filter(
        (note) => !(note instanceof GhostNote),
      );
      if (beamNotes.length > 1) {
        const beam = new Beam(beamNotes);
        if (addPauses) {
          const n = beamNotes.at(0);
          if (n) {
            // Dot.buildAndAttach([n]);
            // n.addModifier(new Dot());
          }
        }
        beam.setPartialBeamSideAt(3, "L");
        beam.setPartialBeamSideAt(2, "L");
        beam.setPartialBeamSideAt(1, "L");
        beam.setPartialBeamSideAt(0, "L");
        beamsExisting.push(beam);
      }
    }

    // for (const [index, bar] of bars.entries()) {
    //   // console.log(bar);
    //   if (duration === "16" && index < bars.length - 1) {
    //     const noteIndex = index % 4;
    //     // console.log({ noteIndex });
    //   }
    //   let staveNote: StemmableNote;

    //   if (bar?.notes?.length) {
    //     const keys = bar.notes.map((part) => NOTES[part]);
    //     staveNote = new StaveNote({ keys, duration });
    //     const stem = new Stem({
    //       stemDirection: 1,
    //     });
    //     staveNote.setStem(stem);
    //     if (background === "dark") {
    //       staveNote.setStyle({ strokeStyle: "white" });
    //     }

    //     if (bar.notes.includes("HIGH_HAT_OPEN")) {
    //       const annotation = new Annotation("O");

    //       staveNote.addModifier(annotation);
    //     }
    //     if (bar.notes.includes("GHOST_SNARE")) {
    //       staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
    //       staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
    //     }
    //     if (bar.notes.includes("ACCENTED_SNARE")) {
    //       const annotation = new Annotation(">");

    //       staveNote.addModifier(annotation);
    //     }
    //   } else {
    //     staveNote = new GhostNote({ duration });
    //   }
    //   if (bar.sticking) {
    //     const annotation = new Annotation(bar.sticking);

    //     staveNote.addModifier(annotation);
    //   }

    //   let note = notes.at(-1);
    //   if (!note) {
    //     note = [];
    //     notes.push(note);
    //   }
    //   note.push(staveNote);

    //   if (note.length === noteLength) {
    //     const beamNotes = note.filter((n) => !(n instanceof GhostNote));
    //     if (beamNotes.length > 1) {
    //       beamsExisting.push(new Beam(beamNotes));
    //     }
    //     notes.push([]);
    //   }
    // }

    console.log("THIS", { notes, beamsExisting });
    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
      resolution: RESOLUTION,
    })
      .setMode(Voice.Mode.FULL)
      .addTickables(notes.flat())
      .setContext(context)
      .setStave(stave);

    const formatter = new Formatter().joinVoices([voice]);
    formatter.formatToStave([voice], stave, {
      alignRests: true,
      stave,
      autoBeam: true,
    });
    // const beams = Beam.generateBeams(notes.flat(), {
    //   stemDirection: 1,
    //   beamMiddleOnly: false,
    //   beamRests: false,
    //   flatBeams: true,
    // });
    // const beams = Beam.applyAndGetBeams(voice, 1, [new Fraction(1, 4)]);

    for (const tickable of voice.getTickables()) {
      if (currentIndex === index) {
        const modifierShift =
          tickable.getModifierContext()?.getLeftShift() ?? 0;

        const originalFillStyle: (typeof context)["fillStyle"] =
          context.fillStyle;
        context.fillStyle = accent ?? "rgba(88, 176, 51, 0.5)";

        context.fillRect(
          tickable.getAbsoluteX() + -modifierShift,
          stave.getY(),
          Math.max(tickable.getWidth(), 15) + modifierShift,
          stave.getHeight(),
        );

        context.fillStyle = originalFillStyle;
      }
      currentIndex++;
    }

    stave.drawWithStyle();
    voice.drawWithStyle();
    for (const beam of beamsExisting) {
      beam.setContext(context).drawWithStyle();
    }
  }
}
