import { useEffect, useRef, useState } from "react";
import { Sampler, ToneAudioBuffer, now } from "tone";

export function useAudioTicks() {
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef<Sampler | null>(null);

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
    bigTick: (duration: number) => {
      sampler.current?.triggerAttackRelease(
        "A1",
        Math.min(duration, 150),
        now(),
      );
    },
    smallTick: (duration: number) => {
      sampler.current?.triggerAttackRelease(
        "C4",
        Math.min(duration, 90, now()),
      );
    },
  };
}
