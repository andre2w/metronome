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
    const scoreRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLImageElement>(null);
    const rendererRef = useRef<Renderer | undefined>();
    const scoreSize = useResizeObserver({
      ref: boxRef,
    });
    const scoreIndexRef = useRef(0);
    const staveIndexRef = useRef(0);
    const flatScore = score.flat().map((n) => n.notes);
    const stavesRef = useRef<NodeListOf<HTMLElement> | undefined>();

    useImperativeHandle(ref, () => ({
      next: () => {
        if (!scoreRef.current) {
          return;
        }

        if (!rendererRef.current) {
          rendererRef.current = new Renderer(
            scoreRef.current,
            Renderer.Backends.CANVAS,
          );
        }

        if (scoreIndexRef.current >= flatScore.length) {
          scoreIndexRef.current = 0;
        }

        const element = scoreRef.current;
        const sheetWidth = scoreSize.width ?? element.getBoundingClientRect().width;
        const renderer = rendererRef.current;
        drawScore({ renderer, score, sheetWidth, index: scoreIndexRef.current });
        scoreIndexRef.current++;

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

        const width = 30;
        cursor.style.top = `${rect.top}px`;
        cursor.style.left = `${rect.right - width}px`;
        cursor.style.width = `${width}px`;
        cursor.style.height = "165px";
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
          Renderer.Backends.CANVAS,
        );
      }

      if (boxRef.current) {
        const boxElement = boxRef.current.getBoundingClientRect();
        scoreRef.current.width = boxElement.width;
        scoreRef.current.height = boxElement.height;
      }

      const element = scoreRef.current;
      
      const sheetWidth =
        scoreSize.width ?? element.getBoundingClientRect().width;
      const renderer = rendererRef.current;

      drawScore({ renderer, score, sheetWidth, index: -1 });
      stavesRef.current =
        document.querySelectorAll<HTMLElement>(".vf-stavenote");
    }, [score, scoreSize.width]);

    return (
      <div ref={boxRef}>
        <canvas ref={scoreRef} />
      </div>
      

    );
  },
);
