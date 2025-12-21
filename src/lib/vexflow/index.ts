import {
  Annotation,
  Beam,
  Dot,
  Formatter,
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
import { NOTES, NotesWithSticking, type Score } from "../types";
import {
  calculateWidthAndPosition,
  createStaveNote,
  groupNotes,
} from "./helpers";
import { parse } from "./parser";

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
    const duration = String(bars.length);
    const groups = groupNotes({ bar: bars, duration });
    const { notes, beams } = parse({
      background,
      groups,
      baseDuration: duration as "4" | "8" | "16",
    });

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
      alignRests: false,
      stave,
      autoBeam: false,
    });

    stave.drawWithStyle();
    voice.drawWithStyle();

    for (const beam of beams) {
      beam.setContext(context).drawWithStyle();
    }
  }
}
