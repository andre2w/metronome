import { useEffect, useRef, useState } from "react";
import { Sampler, ToneAudioBuffer, now } from "tone";
import { calculateBeatTime } from "../../../shared/lib/metronome/beat-time";
import { useScoreContext } from "~/entities/score/model/state/score-store-provider";

interface UseAudioTicksProps {
  notes: number;
  bpm: number;
}

export function useAudioTicks({ notes, bpm }: UseAudioTicksProps) {
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef<Sampler | null>(null);
  const beatTime = calculateBeatTime(bpm, notes);
  const store = useScoreContext();

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
      const cursor = store.getState().metronome.cursor;
      if (cursor.note === 0 && cursor.part === 0) {
        sampler.current?.triggerAttackRelease("A1", Math.min(beatTime, 150), now());
      } else {
        sampler.current?.triggerAttackRelease("C4", Math.min(beatTime, 90, now()));
      }
    },
  };
}
