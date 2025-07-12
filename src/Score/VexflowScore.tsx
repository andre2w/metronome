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
  reset: () => void;
}

export const VexflowScore = forwardRef<VexflowScoreHandle, VexflowScoreProps>(
  ({ score }, ref) => {
    const scoreRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<Renderer | undefined>();
    const scoreSize = useResizeObserver({
      ref: boxRef,
    });
    const scoreIndexRef = useRef(0);
    const flatScore = score.flat().map((n) => n.notes);

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
        const sheetWidth =
          scoreSize.width ?? element.getBoundingClientRect().width;
        const renderer = rendererRef.current;
        drawScore({
          renderer,
          score,
          sheetWidth,
          index: scoreIndexRef.current,
        });
        scoreIndexRef.current++;
      },
      reset: () => {
        scoreIndexRef.current = 0;
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
    }, [score, scoreSize.width]);

    return (
      <div ref={boxRef}>
        <canvas ref={scoreRef} />
      </div>
    );
  },
);
