import {
  Annotation,
  Beam,
  Formatter,
  GhostNote,
  ModifierPosition,
  Parenthesis,
  type Renderer,
  Stave,
  StaveNote,
  type StemmableNote,
  Voice,
} from "vexflow";
import { NOTES, type Score } from "../lib/types";
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

    const notes = [];
    const duration = String(bars.length);

    for (const bar of bars) {
      let staveNote: StemmableNote;

      if (bar?.notes?.length) {
        const keys = bar.notes.map((part) => NOTES[part]);
        staveNote = new StaveNote({ keys, duration });
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
      } else {
        staveNote = new GhostNote({ duration });
      }
      if (bar.sticking) {
        const annotation = new Annotation(bar.sticking);

        staveNote.addModifier(annotation);
      }
      notes.push(staveNote);
    }

    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
      resolution: RESOLUTION,
    })
      .setMode(Voice.Mode.FULL)
      .addTickables(notes)
      .setContext(context)
      .setStave(stave);

    const formatter = new Formatter().joinVoices([voice]);
    const beams = Beam.applyAndGetBeams(voice, 1);
    formatter.formatToStave([voice], stave, { alignRests: true, stave });

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
          tickable.getWidth() + modifierShift,
          stave.getHeight(),
        );

        context.fillStyle = originalFillStyle;
      }
      currentIndex++;
    }

    stave.drawWithStyle();
    voice.drawWithStyle();
    for (const beam of beams) {
      beam.setContext(context).drawWithStyle();
    }
  }
}
