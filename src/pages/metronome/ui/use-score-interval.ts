import { useCallback, useEffect, useRef } from "react";
import { useScoreContext, useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { calculateBeatTime } from "../../../shared/lib/metronome/beat-time";

export interface UseScoreIntervalProps {
  onTick?: () => Promise<void>;
}

export function useScoreInterval({ onTick }: UseScoreIntervalProps) {
  const store = useScoreContext();
  const next = useScoreStore((state) => state.next);
  const toggle = useScoreStore((state) => state.toggle);
  const score = useScoreStore((state) => state.score);
  const bpm = useScoreStore((state) => state.metronome.bpm);
  const started = useScoreStore((state) => state.metronome.started);

  const timeout = useRef<number | undefined>(undefined);

  const ticker = useCallback(() => {
    void onTick?.();

    const cursor = store.getState().metronome.cursor;
    const part = score.bars.at(cursor.bar)?.parts.at(cursor.part);
    if (!part) {
      throw new Error("Missing part");
    }

    const note = part.notes.at(cursor.note);
    if (!note) {
      throw new Error("Missing note");
    }
    let beatTime: number;
    switch (part.tempo) {
      case "sixteens":
        beatTime = calculateBeatTime(bpm, 16);
        break;
      case "quarter":
        beatTime = calculateBeatTime(bpm, 4);
        break;
      case "eights":
        beatTime = calculateBeatTime(bpm, 8);
        break;
      default:
        throw new Error("NOT SUPPORTED");
    }

    timeout.current = setTimeout(() => {
      next();
      ticker();
    }, beatTime);
  }, [onTick, bpm, store, score, next]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (started) {
      ticker();
    }
  }, [ticker, started, score]);

  return { isToggled: started, toggle };
}
