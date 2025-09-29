import { useThemeContext } from "@radix-ui/themes";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import { getRgbaColorString } from "../lib/color";
import { drawScore } from "./draw-score";
import { useScoreStore } from "../lib/zustand-store";

export type VexflowScoreProps = {};

export interface VexflowScoreHandle {
  next: () => void;
  reset: () => void;
}

export const VexflowScore = forwardRef<VexflowScoreHandle, VexflowScoreProps>(
  (_, ref) => {
    const score = useScoreStore((state) => state.score);
    const scoreRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<Renderer | undefined>();
    const scoreSize = useResizeObserver({
      ref: boxRef,
    });
    const scoreIndexRef = useRef(0);
    const flatScore = score.flat().map((n) => n.notes);
    const colorRef = useRef<string | undefined>();
    const { accentColor, appearance } = useThemeContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (boxRef.current) {
        colorRef.current = getRgbaColorString(boxRef.current);
      }
    }, [accentColor]);

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
          colors: {
            accent: colorRef.current,
            background: appearance === "inherit" ? "light" : appearance,
          },
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
        colorRef.current = getRgbaColorString(boxRef.current);
      }

      const element = scoreRef.current;

      const sheetWidth =
        scoreSize.width ?? element.getBoundingClientRect().width;
      const renderer = rendererRef.current;

      drawScore({
        renderer,
        score,
        sheetWidth,
        index: -1,
        colors: {
          accent: colorRef.current,
          background: appearance === "inherit" ? "light" : appearance,
        },
      });
    }, [score, scoreSize.width, appearance]);

    return (
      <div ref={boxRef}>
        <canvas ref={scoreRef} />
      </div>
    );
  },
);
