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
  index: number;
}
export function drawScore({ renderer, sheetWidth, score, index }: DrawScoreProps) {
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
        
        if (index === currentIndex) {
          staveNote.setStyle({
            fillStyle: "red",
            strokeStyle: "red",
          });  
        }
        
        if (bar.notes.includes("HIGH_HAT_OPEN")) {
          staveNote.addModifier(new Annotation("O").setStyle({
            fillStyle: "red",
            strokeStyle: "red",
          }));
        }
        if (bar.notes.includes("GHOST_SNARE")) {
          staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
          staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
        }
        if (bar.notes.includes("ACCENTED_SNARE")) {
          staveNote.addModifier(new Annotation(">").setStyle({
            fillStyle: "red",
            strokeStyle: "red",
          }));
        }
      } else {
        staveNote = new GhostNote({ duration });
      }
      if (bar.sticking) {
        staveNote.addModifier(new Annotation(bar.sticking).setStyle({
            fillStyle: "red",
            strokeStyle: "red",
          }));
      }
      currentIndex++;
      notes.push(staveNote);
    }

    stave.setContext(context).draw();
    Formatter.FormatAndDraw(context, stave, notes, {
      autoBeam: true,
      alignRests: true,      
    });
  }
}
