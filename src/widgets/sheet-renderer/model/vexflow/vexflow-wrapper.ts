import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { calculateWidthAndPosition } from "./helpers";
import { Renderer, StemmableNote } from "vexflow";
import { Score, Tempo } from "~/shared/lib/score/score";
import { STAVE_HEIGHT, STAVE_WIDTH, Y_OFFSET } from "../constants";
import { Key } from "~/shared/lib/score/key-data";
import { Sticking } from "~/shared/lib/score/sticking";
import { MetronomeCursor } from "~/shared/lib/metronome";
import { VexflowBar } from "./vexflow-bar";

export type BackgroundType = "light" | "dark";

export interface DrawProps {
  renderer: Renderer;
  sheetWidth: number;
  score: Score;
}

export interface PlayableNote {
  type: "note";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RestNote {
  type: "rest";
}

export type DrawnNote = PlayableNote | RestNote;

export interface ParsedNote {
  note: StemmableNote;
  shouldDraw: boolean;
  duration: Tempo;
}

export type ReducedStaveNote =
  | {
      type: "note";
      keys: Key[];
      withDot: boolean;
      duration: Tempo;
      sticking?: Sticking;
    }
  | { type: "noop" };

export type RenderColor = "black" | "white";

/**
 * Essa classe tem que ser divida em varias classes para o calculo das notas
 * VexflowPart - aonde pode adicionar notas
 * VexflowBar - aonde pode adicionar VexflowPart
 * VexflowScore - aonde pode adicionar Bars
 */
export class VexflowWrapper {
  #configuration: Configuration;
  #color: RenderColor;
  #drawnNotes: DrawnNote[][][] = [];
  #bars: VexflowBar[] = [];

  constructor(configuration: Configuration, background: BackgroundType) {
    this.#configuration = configuration;
    this.#color = "black";
    this.setColor(background);
  }

  setColor(background: BackgroundType) {
    this.#color = background === "light" ? "black" : "white";
    console.log("Color set to", this.#color, background);
  }

  setConfiguration(configuration: Configuration) {
    this.#configuration = configuration;
  }

  draw({ renderer, sheetWidth, score }: DrawProps) {
    const positions = calculateWidthAndPosition({
      sheetWidth: sheetWidth - 40,
      staveCount: score.bars.length,
      staveHeight: STAVE_HEIGHT,
      staveWidth: STAVE_WIDTH,
      startY: Y_OFFSET,
      startX: 20,
    });

    const height = positions.reduce(
      (prev, curr) => Math.max(prev, curr.y + STAVE_HEIGHT),
      Y_OFFSET,
    );

    renderer.resize(sheetWidth, height);
    const context = renderer.getContext();
    context.clear();

    context.fillStyle = this.#color;
    context.strokeStyle = this.#color;

    this.#bars = [];
    for (let barIndex = 0; barIndex < score.bars.length; barIndex++) {
      const position = positions[barIndex];
      if (!position) {
        throw new Error(`No position found for index: ${barIndex}`);
      }
      const bar = score.bars.at(barIndex);
      if (!bar) {
        throw new Error("Could not find bar");
      }
      this.#bars.push(new VexflowBar(bar, this.#configuration, this.#color, position, barIndex));
    }

    for (const bar of this.#bars) {
      bar.draw(context);
    }
  }

  getDrawnNotes() {
    return this.#drawnNotes;
  }

  getNoteAt({ bar, ...cursor }: MetronomeCursor) {
    return this.#bars?.at(bar)?.getNoteAt(cursor) ?? null;
  }

  getBarPosition({ bar }: Pick<MetronomeCursor, "bar">) {
    return this.#bars?.at(bar)?.getPosition() ?? null;
  }
}
