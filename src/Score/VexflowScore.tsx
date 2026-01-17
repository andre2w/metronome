import { useThemeContext } from "@radix-ui/themes";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import { getRgbaColorString } from "../lib/color";
import { useScoreStore } from "../lib/score/state";
import { drawScore } from "../lib/vexflow";

export type VexflowScoreProps = {};

export interface VexflowScoreHandle {
  setCursor: (index: number) => void;
  clearCursor: () => void;
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
    const colorRef = useRef<string | undefined>();
    const { accentColor, appearance } = useThemeContext();
    const lastIndexRef = useRef<number>(-1);

    const draw = (index: number) => {
      lastIndexRef.current = index;
      if (!scoreRef.current) {
        return;
      }

      if (!rendererRef.current) {
        rendererRef.current = new Renderer(
          scoreRef.current,
          Renderer.Backends.CANVAS,
        );
      }

      const element = scoreRef.current;
      const sheetWidth =
        scoreSize.width ?? element.getBoundingClientRect().width;
      const renderer = rendererRef.current;
      if (boxRef.current) {
        colorRef.current = getRgbaColorString(boxRef.current);
      }
      drawScore({
        renderer,
        score,
        sheetWidth,
        index,
        colors: {
          background: appearance === "inherit" ? "light" : appearance,
          accent: colorRef.current,
        },
      });
    };

    useImperativeHandle(ref, () => ({
      setCursor: (index: number) => {
        draw(index);
      },
      clearCursor: () => {
        draw(-1);
      },
    }));

    useEffect(() => {
      if (boxRef.current) {
        colorRef.current = getRgbaColorString(boxRef.current);
      }
      draw(lastIndexRef.current);
    }, [score, scoreSize.width, appearance, accentColor]);

    return (
      <div ref={boxRef}>
        <canvas ref={scoreRef} />
      </div>
    );
  },
);
