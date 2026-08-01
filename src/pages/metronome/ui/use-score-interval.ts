import { useCallback, useEffect, useRef } from "react";
import { useToggle } from "usehooks-ts";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { calculateBeatTime } from "../model/beat-time";

export interface UseScoreIntervalProps {
  onTick?: () => Promise<void>;
}

export function useScoreInterval({ onTick }: UseScoreIntervalProps) {
  const { bpm, score } = useScoreStoreShallow((state) => ({
    bpm: state.configuration.bpm,
    score: state.score,
  }));
  const flatScore = score.bars.flatMap((n) =>
    n.parts.flatMap((part) => part.notes.map((note) => ({ note, tempo: part.tempo }))),
  );
  const index = useRef(0);
  const [isToggled, toggle] = useToggle();
  const timeout = useRef<number | undefined>(undefined);
  const scoreIndex = useRef(0);

  const ticker = useCallback(async () => {
    await onTick?.();
    const note = flatScore[scoreIndex.current];
    if (!note) {
      throw new Error("Missing note");
    }
    let beatTime: number;
    switch (note.tempo) {
      case "sixteens":
        beatTime = calculateBeatTime(16, bpm);
        break;
      case "quarter":
        beatTime = calculateBeatTime(4, bpm);
        break;
      case "eights":
        beatTime = calculateBeatTime(8, bpm);
        break;
      default:
        throw new Error("NOT SUPPORTED");
    }
    index.current++;
    scoreIndex.current++;
    if (scoreIndex.current >= flatScore.length) {
      scoreIndex.current = 0;
    }

    timeout.current = setTimeout(() => {
      void ticker();
    }, beatTime);
  }, [onTick, flatScore, bpm]);

  useEffect(() => {
    if (!isToggled) {
      index.current = 0;
      scoreIndex.current = 0;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    } else {
      void ticker();
    }
  }, [isToggled, ticker]);

  return { isToggled, toggle };
}
