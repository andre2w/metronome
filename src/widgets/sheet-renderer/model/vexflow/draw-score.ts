import { Formatter, type Renderer, Stave, Voice } from "vexflow";
import { calculateWidthAndPosition } from "./helpers";
import { parse } from "./parser";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { Score } from "~/shared/lib/score/score";

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
  configuration: Configuration;
}

export function drawScore({
  renderer,
  sheetWidth,
  score,
  index,
  colors: { background },
  configuration,
}: DrawScoreProps) {
  const positions = calculateWidthAndPosition({
    sheetWidth: sheetWidth - 40,
    staveCount: score.bars.length,
    staveHeight: STAVE_HEIGHT,
    staveWidth: STAVE_WIDTH,
    startY: Y_OFFSET,
    startX: 20,
  });
  const height = positions.reduce((prev, curr) => Math.max(prev, curr.y + STAVE_HEIGHT), Y_OFFSET);

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

  const drawnNotes: { x: number; y: number; width: number; height: number }[][][] = [];
  for (let i = 0; i < score.bars.length; i++) {
    const position = positions[i];
    if (!position) {
      throw new Error(`No position found for index: ${i}`);
    }
    const stave = new Stave(position.x, position.y, position.width);
    stave.setContext(context);

    if (i === 0) {
      stave.addClef("treble").addTimeSignature("4/4");
    }

    const bar = score.bars[i];
    if (!bar) {
      throw new Error(`Invalid bars at index: ${i}`);
    }

    const { notes, beams } = parse({
      background,
      cursorIndex: index,
      configuration,
      bar,
    });

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

    drawnNotes.push([]);
    for (let partIndex = 0; partIndex < notes.length; partIndex++) {
      drawnNotes[i]?.push([]);
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
        drawnNotes[i]?.[partIndex]?.push({
          x: cursorNote.getAbsoluteX() + -modifierShift,
          y: stave.getY(),
          width: Math.max(cursorNote.getWidth(), 15) + modifierShift,
          height: stave.getHeight(),
        });
      }
    }
  }

  return drawnNotes;
}
