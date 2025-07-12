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
}

export function drawScore({
  renderer,
  sheetWidth,
  score,
  index,
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
  
  const staves: Stave[] = [];
  const voices: Voice[] = [];

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

        // if (isHighlighted) {
        //   staveNote.setStyle({
        //     fillStyle: "red",
        //     strokeStyle: "red",
        //   });
        // }

        if (bar.notes.includes("HIGH_HAT_OPEN")) {
          const annotation = new Annotation("O");

          // if (isHighlighted) {
          //   annotation.setStyle({
          //     fillStyle: "red",
          //     strokeStyle: "red",
          //   });
          // }

          staveNote.addModifier(annotation);
        }
        if (bar.notes.includes("GHOST_SNARE")) {
          staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
          staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
        }
        if (bar.notes.includes("ACCENTED_SNARE")) {
          const annotation = new Annotation(">");

          // if (isHighlighted) {
          //   annotation.setStyle({
          //     fillStyle: "red",
          //     strokeStyle: "red",
          //   });
          // }

          staveNote.addModifier(annotation);
        }
      } else {
        staveNote = new GhostNote({ duration });
      }
      if (bar.sticking) {
        const annotation = new Annotation(bar.sticking);
        // if (isHighlighted) {
        //   annotation.setStyle({
        //     fillStyle: "red",
        //     strokeStyle: "red",
        //   });
        // }
        staveNote.addModifier(annotation);
      }      
      notes.push(staveNote);
    }

    staves.push(stave);    
    const voice = new Voice({ numBeats: 4, beatValue: 4, resolution: RESOLUTION }).setMode(Voice.Mode.FULL).addTickables(notes);
    voice.setContext(context);
    voice.setStave(stave);
    voices.push(voice);

    const formatter = new Formatter().joinVoices([voice]);
    const beams = Beam.applyAndGetBeams(voice, 1);
    formatter.formatToStave([voice], stave, { alignRests: true, stave});

    
    for (const tickable of voice.getTickables()) {
      if (currentIndex === index) {
        console.log({ 
          tick: {
            absoluteX: tickable.getAbsoluteX(),
            x: tickable.getX(),
            xShift: tickable.getXShift(),
            width: tickable.getWidth(),
            height: tickable.getHeight(),
            y: tickable.getY(),
          },
          stave: {
            y: stave.getY(),
            boundingBox: stave.getBoundingBox(),
          }
        });
        console.log({
          x: tickable.getAbsoluteX(), y: stave.getY(), width: tickable.getWidth(), height: stave.getHeight()
        });
        const originalFillStyle = context.fillStyle;
        context.fillStyle = ("rgba(88, 176, 51, 0.5)")
        context.fillRect(tickable.getAbsoluteX(), stave.getY(), tickable.getWidth(), stave.getHeight());
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
