import { useThemeContext } from "@radix-ui/themes";
import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer, StemmableNote } from "vexflow";
import { getRgbaColorString } from "../model/vexflow/color";
import { drawScore } from "../model";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { Note } from "~/entities/score/model/types";
import { useWaveform } from "../../../pages/waveform/ui/use-waveform";

export type VexflowScoreProps = {};

export interface VexflowScoreHandle {
  next: () => void;
  reset: () => void;
}

export const SheetRenderer = forwardRef<VexflowScoreHandle, VexflowScoreProps>((_, ref) => {
  const score = useScoreStore((state) => state.score);
  const scoreRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | undefined>(undefined);
  const scoreSize = useResizeObserver({
    ref: boxRef as RefObject<HTMLDivElement>,
  });
  const scoreIndexRef = useRef(0);
  const flatScore = score.bars.flatMap((n) => n.parts.flatMap((part) => part.notes));
  const colorRef = useRef<string | undefined>(undefined);
  const { accentColor, appearance } = useThemeContext();
  const configuration = useConfiguration();
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const zippedNotes = useRef<{ play: Note; drawn?: ReturnType<typeof drawScore>[number] }[]>([]);
  const a = useWaveform();
  useEffect(() => {
    if (boxRef.current) {
      colorRef.current = getRgbaColorString(boxRef.current);
    }
  }, [accentColor]);

  const canvasSize = useResizeObserver({
    ref: scoreRef as RefObject<HTMLCanvasElement>,
  });

  useImperativeHandle(ref, () => ({
    next: () => {
      if (!scoreRef.current) {
        return;
      }

      if (!rendererRef.current) {
        rendererRef.current = new Renderer(scoreRef.current, Renderer.Backends.CANVAS);
      }

      if (scoreIndexRef.current >= flatScore.length) {
        scoreIndexRef.current = 0;
      }

      const zippedNote = zippedNotes.current.at(scoreIndexRef.current);
      if (!zippedNote) {
        throw new Error("Missing note");
      }
      const { drawn } = zippedNote;
      const canvas = cursorCanvasRef.current?.getContext("2d");

      if (!canvas) {
        throw new Error("Could not get canvas");
      }
      canvas.clearRect(
        0,
        0,
        cursorCanvasRef.current?.width ?? 0,
        cursorCanvasRef.current?.height ?? 0,
      );

      if (drawn) {
        canvas.fillStyle = accentColor ?? "rgba(88, 176, 51, 0.5)";

        console.log(drawn);

        canvas.fillRect(drawn.x, drawn.y, drawn.width, drawn.height);
      }
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
      rendererRef.current = new Renderer(scoreRef.current, Renderer.Backends.CANVAS);
    }

    if (boxRef.current) {
      const boxElement = boxRef.current.getBoundingClientRect();
      scoreRef.current.width = boxElement.width;
      scoreRef.current.height = boxElement.height;
      colorRef.current = getRgbaColorString(boxRef.current);
    }

    const element = scoreRef.current;

    const sheetWidth = scoreSize.width ?? element.getBoundingClientRect().width;
    const renderer = rendererRef.current;
    if (!renderer) {
      throw new Error("Renderer not set");
    }
    const drawnNotes = drawScore({
      renderer,
      score,
      sheetWidth,
      index: -1,
      colors: {
        background: appearance === "inherit" ? "light" : appearance,
        accent: colorRef.current,
      },
      configuration,
    });
    const zipped: { play: Note; drawn?: ReturnType<typeof drawScore>[number] }[] = [];
    for (const note of flatScore) {
      if (note.keys.length > 0) {
        const drawn = drawnNotes.shift();
        if (!drawn) {
          throw new Error("Failed to get drawn note");
        }
        zipped.push({ drawn, play: note });
      } else {
        zipped.push({ play: note });
      }
    }
    zippedNotes.current = zipped;
  }, [score, scoreSize.width, appearance, accentColor]);

  useLayoutEffect(() => {
    if (cursorCanvasRef.current) {
      if (canvasSize.width) {
        cursorCanvasRef.current.width = canvasSize.width;
      }
      if (canvasSize.height) {
        cursorCanvasRef.current.height = canvasSize.height;
      }
      const scoreRect = scoreRef.current?.getBoundingClientRect();
      if (scoreRect) {
        cursorCanvasRef.current.style.left = `${scoreRect.left}px`;
      }
    }
  }, [canvasSize, scoreRef]);

  return (
    <div ref={boxRef}>
      <canvas ref={scoreRef} />
      <canvas ref={cursorCanvasRef} style={{ position: "absolute" }} />
    </div>
  );
});
