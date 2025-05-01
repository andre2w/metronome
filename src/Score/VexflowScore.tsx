import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import type { Score } from "../lib/types";
import { drawScore } from "./draw-score";

export interface VexflowScoreProps {
  score: Score;
}

export interface VexflowScoreHandle {
  next: () => void;
  showCursor: () => void;
  hideCursor: () => void;
  reset: () => void;
}

export const VexflowScore = forwardRef<VexflowScoreHandle, VexflowScoreProps>(
  ({ score }, ref) => {
    const scoreRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLImageElement>(null);
    const rendererRef = useRef<Renderer | undefined>();
    const scoreSize = useResizeObserver({
      ref: scoreRef,
    });
    const scoreIndexRef = useRef(0);
    const staveIndexRef = useRef(0);
    const flatScore = score.flat().map((n) => n.notes);
    const stavesRef = useRef<NodeListOf<HTMLElement> | undefined>();

    useImperativeHandle(ref, () => ({
      next: () => {
        const cursor = cursorRef.current;
        const staves = stavesRef.current;
        if (!cursor) {
          return;
        }

        if (!staves || !staves.length) {
          return;
        }

        if (staveIndexRef.current >= (staves.length ?? 0)) {
          staveIndexRef.current = 0;
        }

        if (scoreIndexRef.current >= flatScore.length) {
          scoreIndexRef.current = 0;
        }

        if (!flatScore.at(scoreIndexRef.current)?.length) {
          cursor.style.visibility = "hidden";
          scoreIndexRef.current++;
          return;
        }

        const rect = staves
          .item(staveIndexRef.current)
          ?.getBoundingClientRect();
        if (!rect) {
          return;
        }

        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.left}px`;
        cursor.style.width = `${rect.width}px`;
        cursor.style.height = `${rect.height}px`;
        cursor.style.visibility = "visible";
        staveIndexRef.current++;
        scoreIndexRef.current++;
      },
      hideCursor: () => {
        if (cursorRef.current) {
          cursorRef.current.style.visibility = "hidden";
        }
      },
      showCursor: () => {
        if (cursorRef.current) {
          cursorRef.current.style.visibility = "visible";
        }
      },
      reset: () => {
        scoreIndexRef.current = 0;
        staveIndexRef.current = 0;
      },
    }));

    useEffect(() => {
      if (!scoreRef.current) {
        return;
      }

      if (!rendererRef.current) {
        rendererRef.current = new Renderer(
          scoreRef.current,
          Renderer.Backends.SVG,
        );
      }

      const element = scoreRef.current;
      const sheetWidth =
        scoreSize.width ?? element.getBoundingClientRect().width;
      const renderer = rendererRef.current;

      drawScore({ renderer, score, sheetWidth });
      stavesRef.current =
        document.querySelectorAll<HTMLElement>(".vf-stavenote");
    }, [score, scoreSize.width]);

    return (
      <div style={{ marginTop: "10px" }} ref={scoreRef}>
        <img
          ref={cursorRef}
          alt="cursor"
          id="cursor"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAABCAYAAAAxUOUbAAAAAXNSR0IArs4c6QAAAC5JREFUGFdjfPr7acOFH+cYQPj8r4sM937dYSAVKLGpMBiy6TMYcJgwGHAYMAAAGFUPRw5ILS0AAAAASUVORK5CYII="
          width="21"
          height="300"
          style={{
            position: "absolute",
            zIndex: -1,
            top: 0,
            right: 0,
            visibility: "hidden",
          }}
        />
      </div>
    );
  },
);
