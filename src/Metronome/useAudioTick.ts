import { useEffect, useRef } from "react";
import { nextInLoop } from "../utils";

interface UseAudioTicksProps {
  notes: number;
}

export function useAudioTicks({ notes }: UseAudioTicksProps) {
  const bigTick = useRef<HTMLAudioElement | undefined>();
  const smallTick = useRef<HTMLAudioElement | undefined>();
  const indexRef = useRef(-1);

  useEffect(() => {
    bigTick.current = new Audio("/metronome1Count.mp3");
    smallTick.current = new Audio("/metronomeClick.mp3");
  }, []);

  return {
    playNextTick: async () => {
      indexRef.current = nextInLoop(indexRef.current, notes);

      if (indexRef.current % (notes / 4) === 0) {
        bigTick.current?.load();
        await bigTick.current?.play();
      } else {
        smallTick.current?.load();
        await smallTick.current?.play();
      }
    },

    reset: () => {
      indexRef.current = -1;
    },
  };
}
