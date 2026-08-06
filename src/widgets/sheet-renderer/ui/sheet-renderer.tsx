import { useThemeContext } from "@radix-ui/themes";
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import { getRgbaColorString } from "../model/vexflow/color";
import { drawScore } from "../model";
import {
  useScoreStore,
  useScoreStoreSubscription,
} from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { isCursorEquals, MetronomeCursor } from "~/shared/lib/metronome/cursor";
import { VexflowWrapper } from "../model/vexflow/vexflow-wrapper";

export function SheetRenderer() {
  const score = useScoreStore((state) => state.score);
  const scoreRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | undefined>(undefined);
  const scoreSize = useResizeObserver({
    ref: boxRef as RefObject<HTMLDivElement>,
  });
  const colorRef = useRef<string | undefined>(undefined);
  const { accentColor, appearance } = useThemeContext();
  const configuration = useConfiguration();
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawnNotesRef = useRef<ReturnType<typeof drawScore>>([]);

  const next = useCallback(
    (cursor: MetronomeCursor) => {
      if (!scoreRef.current) {
        return;
      }

      if (!rendererRef.current) {
        rendererRef.current = new Renderer(scoreRef.current, Renderer.Backends.CANVAS);
      }

      const drawnNote = drawnNotesRef.current.at(cursor.bar)?.at(cursor.part)?.at(cursor.note);
      if (!drawnNote) {
        throw new Error("Could not find note for cursor");
      }

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

      const noteToPlay = score.bars.at(cursor.bar)?.parts.at(cursor.part)?.notes.at(cursor.note);
      if (!noteToPlay) {
        throw new Error("Could no find note for cursor");
      }

      if (noteToPlay.keys.length === 0) {
        return;
      }

      if (drawnNote) {
        canvas.fillStyle = colorRef.current ?? "rgba(88, 176, 51, 0.5)";
        canvas.fillRect(drawnNote.x, drawnNote.y, drawnNote.width, drawnNote.height);
      }
    },
    [score],
  );

  useScoreStoreSubscription((state, oldState) => {
    console.log({ state, oldState });
    if (isCursorEquals(state.metronome.cursor, oldState.metronome.cursor)) {
      return;
    }

    next(state.metronome.cursor);
  });

  useEffect(() => {
    if (boxRef.current) {
      colorRef.current = getRgbaColorString(boxRef.current);
    }
  }, [accentColor]);

  const canvasSize = useResizeObserver({
    ref: scoreRef as RefObject<HTMLCanvasElement>,
  });

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

    const wrapper = new VexflowWrapper(
      configuration,
      appearance === "inherit" ? "light" : appearance,
    );
    console.log(wrapper.draw({ renderer, score, sheetWidth }));
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

    drawnNotesRef.current = drawnNotes;
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
}
