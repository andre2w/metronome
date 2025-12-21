import {
  Annotation,
  Dot,
  ModifierPosition,
  Parenthesis,
  StaveNote,
  Stem,
} from "vexflow";
import { Bar, NOTES, NotesWithSticking } from "../types";
import { REST_KEY } from "./constants";

export interface CalculateWidthAndPositionProps {
  sheetWidth: number;
  staveWidth: number;
  staveHeight: number;
  staveCount: number;
  startY?: number;
  startX?: number;
}

export interface StavePosition {
  x: number;
  y: number;
  width: number;
}

export function calculateWidthAndPosition(
  props: CalculateWidthAndPositionProps,
): StavePosition[] {
  if (props.staveCount < 1) {
    return [];
  }

  if (props.staveCount === 1) {
    return [{ y: props.startY ?? 0, x: 0, width: props.sheetWidth }];
  }

  const lines: StavePosition[][] = [[]];
  let x = props.startX ?? 0;

  function fixLastLine() {
    const lineWidth = lines
      .at(-1)
      ?.reduce((total, stave) => total + stave.width, 0);
    const staveCount = lines.at(-1)?.length;
    if (lineWidth && staveCount) {
      const staveDifference = Math.floor(props.sheetWidth / staveCount);
      let x = props.startX ?? 0;
      for (let i = 0; i < lines[lines.length - 1].length; i++) {
        lines[lines.length - 1][i].width = staveDifference;
        lines[lines.length - 1][i].x = x;
        x += staveDifference;
      }
    }
  }

  for (let i = 0; i < props.staveCount; i++) {
    const lineWidth = lines
      .at(-1)
      ?.reduce((total, stave) => total + stave.width, 0);
    if (lineWidth && lineWidth + props.staveWidth > props.sheetWidth) {
      fixLastLine();
      lines.push([]);
      x = props.startX ?? 0;
    }

    const line = lines.at(-1);
    const y = (props.startY ?? 0) + props.staveHeight * (lines.length - 1);
    line?.push({ y, x, width: props.staveWidth });
    x += props.staveWidth;
  }

  fixLastLine();

  return lines.flat();
}

/**
 * Group the notes of a bar into their respective countings based on the duration so you will have:
 * - 4: 1, 2, 3, 4
 * - 8: 1 and, 2 and, 3 and, 4 and
 * - 16: 1 e & a, 2 e & a...
 */
export function groupNotes({ bar, duration }: { bar: Bar; duration: string }) {
  const size = duration === "4" ? 1 : duration === "8" ? 2 : 4;

  return bar.reduce<NotesWithSticking[][]>(
    (acc, curr) => {
      if (acc[acc.length - 1].length >= size) {
        acc.push([]);
      }
      acc.at(-1)?.push(curr);
      return acc;
    },
    [[]],
  );
}

export function createStaveNote({
  bar,
  duration,
  background,
  withDot = false,
}: {
  duration: string;
  bar: NotesWithSticking;
  background: "light" | "dark";
  withDot?: boolean;
}) {
  const isRest = bar.notes.length === 0;
  const keys = isRest ? [REST_KEY] : bar.notes.map((note) => NOTES[note]);
  const noteDuration = isRest ? `${duration}r` : duration;
  const staveNote = new StaveNote({ keys, duration: noteDuration });

  if (!isRest) {
    const stem = new Stem({
      stemDirection: 1,
    });
    staveNote.setStem(stem);
  }

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
  if (bar.sticking) {
    const annotation = new Annotation(bar.sticking);
    staveNote.addModifier(annotation);
  }
  if (withDot) {
    Dot.buildAndAttach([staveNote]);
  }
  return staveNote;
}
