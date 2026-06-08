import { Annotation, Dot, ModifierPosition, Parenthesis, StaveNote, Stem } from "vexflow";
import { type Bar, type NotesWithSticking } from "../../../../entities/score/model/types";
import { REST_KEY } from "./constants";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";

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

export function calculateWidthAndPosition(props: CalculateWidthAndPositionProps): StavePosition[] {
  if (props.staveCount < 1) {
    return [];
  }

  if (props.staveCount === 1) {
    return [{ y: props.startY ?? 0, x: 0, width: props.sheetWidth }];
  }

  const lines: StavePosition[][] = [[]];
  let x = props.startX ?? 0;

  function fixLastLine() {
    const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width, 0);
    const staveCount = lines.at(-1)?.length;
    if (lineWidth && staveCount) {
      const staveDifference = Math.floor(props.sheetWidth / staveCount);
      let x = props.startX ?? 0;
      const line = lines[lines.length - 1];

      if (!line) {
        throw new Error(`No line at index: ${lines.length - 1}`);
      }

      for (let i = 0; i < line.length; i++) {
        const bar = line[i];
        if (!bar) {
          throw new Error(`No bar for line ${i}`);
        }
        bar.width = staveDifference;
        bar.x = x;
        x += staveDifference;
      }
    }
  }

  for (let i = 0; i < props.staveCount; i++) {
    const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width, 0);
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
export function groupNotes({
  bar,
  duration,
  offset,
}: {
  bar: Bar;
  duration: string;
  offset: number;
}) {
  const size = duration === "4" ? 1 : duration === "8" ? 2 : 4;

  return bar.reduce<(NotesWithSticking & { index: number })[][]>(
    (acc, curr, index) => {
      const group = acc[acc.length - 1];
      if (group && group.length >= size) {
        acc.push([]);
      }
      acc.at(-1)?.push({ ...curr, index: index + offset });
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
  configuration,
}: {
  duration: string;
  bar: NotesWithSticking;
  background: "light" | "dark";
  withDot?: boolean;
  configuration: Configuration;
}) {
  const isRest = bar.notes.length === 0;
  console.log("BAR", bar);
  const keys = isRest ? [REST_KEY] : bar.notes.map((key) => configuration.getKeyValue(key));
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

  for (const { note, modifier } of bar.notes) {
    if (!modifier) {
      continue;
    }
    const noteData = configuration.getKeyData(note);

    if (!noteData) {
      throw new Error(`Could not find data for note: ${note}`);
    }

    if (noteData.modifiers) {
      const modifierData = noteData.modifiers[modifier];
      if (modifierData) {
        switch (modifierData.modifier.type) {
          case "annotation":
            staveNote.addModifier(new Annotation(modifierData.modifier.value));
            break;
          case "parenthesis":
            if (modifierData.modifier.which === "both") {
              staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
              staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
            }
            if (modifierData.modifier.which === "left") {
              staveNote.addModifier(new Parenthesis(ModifierPosition.LEFT), 0);
            }
            if (modifierData.modifier.which === "right") {
              staveNote.addModifier(new Parenthesis(ModifierPosition.RIGHT), 0);
            }
            break;
          case "value-override":
            break;
        }
      }
    }
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
