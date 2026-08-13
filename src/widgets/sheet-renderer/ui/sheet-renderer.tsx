import { useThemeContext } from "@radix-ui/themes";
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import { getRgbaColorString } from "../model/vexflow/color";
import {
  useScoreContext,
  useScoreStoreShallow,
  useScoreStoreSubscription,
} from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { isCursorEquals, MetronomeCursor } from "~/shared/lib/metronome/cursor";
import { VexflowWrapper } from "../model/vexflow/vexflow-wrapper";
import { Score } from "~/shared/lib/score/score";
import { STAVE_HEIGHT } from "../model/constants";

export interface SheetRendererRef {
  hightlightNote: (cursor: MetronomeCursor | null) => void;
  hightlightBar: (cursor: Pick<MetronomeCursor, "bar"> | null) => void;
}

type HoveredCursor = MetronomeCursor | Pick<MetronomeCursor, "bar"> | null;

export const SheetRenderer = forwardRef<SheetRendererRef, {}>((_, ref) => {
  const bars = useScoreStoreShallow((state) => state.score.bars);
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
  const store = useScoreContext();
  const vexflowWrapper = useMemo(() => {
    return new VexflowWrapper(configuration, appearance === "inherit" ? "light" : appearance);
  }, [appearance, configuration]);
  /**
   * We keep this hoveredRef for when we rerender the canvas for other reasons we
   * also highlight the same
   */
  const hoveredRef = useRef<HoveredCursor>(null);

  useImperativeHandle(ref, () => ({
    hightlightBar: (cursor) => {
      if (store.getState().metronome.started) {
        return;
      }
      hoveredRef.current = cursor;
      renderCursor(cursor);
    },
    hightlightNote: (cursor) => {
      if (store.getState().metronome.started) {
        return;
      }
      hoveredRef.current = cursor;
      renderCursor(cursor);
    },
  }));

  const renderCursor = useCallback(
    (cursor: HoveredCursor) => {
      if (!scoreRef.current) {
        return;
      }

      if (!rendererRef.current) {
        rendererRef.current = new Renderer(scoreRef.current, Renderer.Backends.CANVAS);
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

      if (cursor === null) {
        return;
      }

      let position: { x: number; y: number; width: number; height: number };
      if ("note" in cursor) {
        const noteToPlay = bars.at(cursor.bar)?.parts.at(cursor.part)?.notes.at(cursor.note);
        if (!noteToPlay) {
          throw new Error("Could no find note for cursor");
        }

        if (noteToPlay.keys.length === 0) {
          return;
        }

        const drawnNote = vexflowWrapper.getNoteAt(cursor);
        if (!drawnNote || drawnNote.type === "rest") {
          return;
        }

        position = drawnNote;
      } else {
        const barPosition = vexflowWrapper.getBarPosition(cursor);
        if (!barPosition) {
          throw new Error("Cloud not find bar for cursor");
        }
        position = { ...barPosition, height: STAVE_HEIGHT };
      }

      canvas.fillStyle = colorRef.current ?? "rgba(88, 176, 51, 0.5)";
      canvas.fillRect(position.x, position.y, position.width, STAVE_HEIGHT);
    },
    [bars, vexflowWrapper],
  );

  useScoreStoreSubscription((state, oldState) => {
    if (isCursorEquals(state.metronome.cursor, oldState.metronome.cursor)) {
      return;
    }

    renderCursor(state.metronome.cursor);
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

    const element = scoreRef.current;

    const sheetWidth = scoreSize.width ?? element.getBoundingClientRect().width;
    const renderer = rendererRef.current;
    if (!renderer) {
      throw new Error("Renderer not set");
    }
    const score: Score = {
      author: "",
      bars,
      bpm: 100,
      name: "",
      type: "score",
    };
    vexflowWrapper.draw({ renderer, score, sheetWidth });

    if (!store.getState().metronome.started && hoveredRef.current) {
      renderCursor(hoveredRef.current);
    }
  }, [bars, scoreSize.width, vexflowWrapper]);

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
