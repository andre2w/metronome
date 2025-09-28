import { useEffect, useRef, useState } from "react";
import { nextInLoop } from "../utils";
import { Sampler, ToneAudioBuffer } from "tone";
import { calculateBeatTime } from "../lib/beat-time";

interface UseAudioTicksProps {
  notes: number;
  bpm: number;
}

export function useAudioTicks({ notes, bpm }: UseAudioTicksProps) {
  const indexRef = useRef(-1);
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef<Sampler | null>(null);
  const beatTime = calculateBeatTime(bpm, notes);

  useEffect(() => {
    sampler.current = new Sampler(
      {
        A1: new ToneAudioBuffer("/metronome1Count.mp3"),
        C4: new ToneAudioBuffer("/metronomeClick.mp3"),
      },
      {
        onload: () => {
          setLoaded(true);
        },
      },
    ).toDestination();
  }, []);

  return {
    isLoaded,
    playNextTick: async () => {
      indexRef.current = nextInLoop(indexRef.current, notes);

      if (indexRef.current === 0) {
        sampler.current?.triggerAttackRelease("A1", Math.min(beatTime, 150));
      } else {
        sampler.current?.triggerAttackRelease("C4", Math.min(beatTime, 90));
      }
    },

    reset: () => {
      indexRef.current = -1;
    },
  };
}
