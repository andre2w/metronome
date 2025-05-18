import {
  Annotation,
  Formatter,
  GhostNote,
  ModifierPosition,
  Parenthesis,
  type Renderer,
  Stave,
  StaveNote,
  type StemmableNote,
} from "vexflow";
import { NOTES, type Score } from "../lib/types";
import { calculateWidthAndPosition } from "./helpers";

const Y_OFFSET = 50;
const STAVE_HEIGHT = 150;
const STAVE_WIDTH = 300;

export interface DrawScoreProps {
  renderer: Renderer;
  sheetWidth: number;
  score: Score;
}
export function drawScore({ renderer, sheetWidth, score }: DrawScoreProps) {
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
  context.setFillStyle("var(--accent-9)");
  context.setStrokeStyle("var(--accent-9)");
  if (!score.length) {
    const stave = new Stave(0, 0, 0);
    stave.setStyle({
      fillStyle: "var(--accent-9)",
      strokeStyle: "var(--accent-9)",
    });
    stave.setContext(context).draw();
    Formatter.FormatAndDraw(context, stave, [], {
      autoBeam: true,
      alignRests: true,
    });
    return;
  }

  for (let i = 0; i < score.length; i++) {
    const position = positions[i];
    const stave = new Stave(position.x, position.y, position.width);

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
        staveNote = new StaveNote({ keys, duration }).setStyle({
          fillStyle: "var(--accent-9)",
          strokeStyle: "var(--accent-9)",
        });
        if (bar.notes.includes("HIGH_HAT_OPEN")) {
          staveNote.addModifier(new Annotation("O"));
        }
        if (bar.notes.includes("GHOST_SNARE")) {
          staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
          staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
        }
        if (bar.notes.includes("ACCENTED_SNARE")) {
          staveNote.addModifier(new Annotation(">"));
        }
      } else {
        staveNote = new GhostNote({ duration });
      }
      if (bar.sticking) {
        staveNote.addModifier(new Annotation(bar.sticking));
      }
      notes.push(staveNote);
    }

    stave.setContext(context).draw();
    Formatter.FormatAndDraw(context, stave, notes, {
      autoBeam: true,
      alignRests: true,
    });
  }
}
