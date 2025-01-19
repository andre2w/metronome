import { Flow } from "vexflow";
import { Score, NOTES } from "../lib/types";
import { useRef } from "react";

export interface UseVexflowProps {
  element: HTMLCanvasElement | null;
}

export function useVexflow() {
  const rendererRef = useRef<Flow.Renderer | undefined>();

  const draw = (score: Score, element: HTMLDivElement | null) => {
    if (!element) {
      console.error("Element not present");
      return;
    }
    if (!rendererRef.current) {
      rendererRef.current = new Flow.Renderer(element, Flow.Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;

    const sheetWidth = element.getBoundingClientRect().width;
    renderer.resize(sheetWidth, 500);
    const context = renderer.getContext();
    context.clear();

    const positions = calculateWidthAndPosition({
      sheetWidth: sheetWidth - 20,
      staveCount: score.length,
      staveHeight: 150,
      staveWidth: 300,
      startY: 10,
      startX: 10
    });
    for (let i = 0; i < score.length; i++) {
      const position = positions[i];
      const stave = new Flow.Stave(position.x, position.y, position.width);

       if (i === 0) {
        stave.addClef("treble").addTimeSignature("4/4");
      }

      const bars = score[i];

      const notes = [];
      const duration = String(bars.length);
      for (const bar of bars) {
        if (bar && bar.length) {
          const note = bar.map(part => NOTES[part]);
          notes.push(new Flow.StaveNote({ keys: note, duration }));
        } else {
          notes.push(new Flow.GhostNote({ duration }));
        }
      }

      stave.setContext(context).draw();
      Flow.Formatter.FormatAndDraw(context, stave, notes, {
        auto_beam: true,
        align_rests: true,
      });
    }
  };

  return { draw };
}

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
    return []
  }

  if (props.staveCount === 1) {
    return [{ y: props.startY ?? 0, x: 0, width: props.sheetWidth }];
  }

  const lines: StavePosition[][] = [[]];
  let x = props.startX ?? 0;

  for (let i = 0; i < props.staveCount; i++) {
    const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width , 0);
    if (lineWidth && lineWidth + props.staveWidth > props.sheetWidth) {
      const staveCount = lines.at(-1)!.length;
      const width = Math.floor((props.sheetWidth - (props.startX ?? 0)) / staveCount);
      const y = lines[lines.length - 1][0].y;
      const fixedStaves = calculateWidthAndPosition({
        sheetWidth: props.sheetWidth,
        staveCount,
        staveHeight: props.staveHeight,
        staveWidth: width,
        startY: y,
        startX: props.startX
      });
      lines[lines.length - 1] = fixedStaves;     

      lines.push([]);
      x = props.startX ?? 0;
    }
 
    const line = lines.at(-1);
    const y = (props.startY ?? 0) + (props.staveHeight * (lines.length - 1));
    line?.push({ y, x, width: props.staveWidth });
    x += props.staveWidth;
  }

  const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width , 0);
  const staveCount = lines.at(-1)?.length;
  if (lineWidth && staveCount && lineWidth < props.sheetWidth) {
    const totalDifference = props.sheetWidth - lineWidth;
    if (totalDifference <= 5) {
      lines[lines.length - 1][lines[lines.length - 1].length - 1].width += totalDifference;
    } else {
      const width = Math.floor(props.sheetWidth / staveCount);
      const y = lines[lines.length - 1][0].y;
      const fixedStaves = calculateWidthAndPosition({
        sheetWidth: props.sheetWidth,
        staveCount,
        staveHeight: props.staveHeight,
        staveWidth: width,
        startY: y,
        startX: props.startX
      });
      lines[lines.length - 1] = fixedStaves;
    }

  }

  return lines.flat();
}
