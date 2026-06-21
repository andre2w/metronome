import { useCallback, useEffect, useRef } from "react";
import { useToggle } from "usehooks-ts";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { calculateBeatTime } from "../model/beat-time";

export interface UseScoreIntervalProps {
  onTick?: () => Promise<void> | void;
}

export function useScoreInterval({ onTick }: UseScoreIntervalProps) {
  const { tempo, bpm } = useScoreStoreShallow((state) => ({
    tempo: state.configuration.signature,
    bpm: state.configuration.bpm,
  }));

  const index = useRef(0);
  const beatTime = calculateBeatTime(bpm, tempo);
  const [isToggled, toggle] = useToggle();
  const timeout = useRef<number | undefined>(undefined);

  const ticker = useCallback(() => {
    onTick?.();
    index.current++;
    timeout.current = setTimeout(() => {
      ticker();
    }, beatTime);
  }, [onTick]);

  useEffect(() => {
    if (!isToggled) {
      index.current = 0;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    } else {
      ticker();
    }
  }, [isToggled]);

  return { isToggled, toggle };
}
