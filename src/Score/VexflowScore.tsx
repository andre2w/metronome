import { useEffect, useRef } from "react";
import { NOTES, type Score } from "../lib/types";
import { calculateWidthAndPosition } from "./helpers";
import { Flow } from "vexflow";
import { useResizeObserver } from "usehooks-ts";

const Y_OFFSET = 50;
const STAVE_HEIGHT = 150;
const STAVE_WIDTH = 300;

export function VexflowScore({ score }: { score: Score }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<Flow.Renderer | undefined>();
  const scoreSize = useResizeObserver({
    ref: divRef,
  });

  useEffect(() => {
    if (!divRef.current) {
      return;
    }
    if (!rendererRef.current) {
      rendererRef.current = new Flow.Renderer(
        divRef.current,
        Flow.Renderer.Backends.SVG,
      );
    }

    const element = divRef.current;
    const sheetWidth = scoreSize.width ?? element.getBoundingClientRect().width;

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

    const renderer = rendererRef.current;

    renderer.resize(sheetWidth, height);
    const context = renderer.getContext();
    context.clear();
    context.setFillStyle("var(--accent-9)");
    context.setStrokeStyle("var(--accent-9)");
    if (!score.length) {
      const stave = new Flow.Stave(0, 0, 0);
      stave.setContext(context).draw();
      Flow.Formatter.FormatAndDraw(context, stave, [], {
        auto_beam: true,
        align_rests: true,
      });
      return;
    }

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
        let staveNote: Flow.StemmableNote;
        if (bar?.notes?.length) {
          const keys = bar.notes.map((part) => NOTES[part]);
          staveNote = new Flow.StaveNote({ keys, duration });
          if (bar.notes.includes("HIGH_HAT_OPEN")) {
            staveNote.addModifier(new Flow.Annotation("O"));
          }
        } else {
          staveNote = new Flow.GhostNote({ duration });
        }
        if (bar.sticking) {
          staveNote.addModifier(new Flow.Annotation(bar.sticking));
        }
        notes.push(staveNote);
      }

      stave.setContext(context).draw();
      Flow.Formatter.FormatAndDraw(context, stave, notes, {
        auto_beam: true,
        align_rests: true,
      });
    }
  }, [score, scoreSize.width]);

  return <div style={{ marginTop: "10px" }} ref={divRef} />;
}
