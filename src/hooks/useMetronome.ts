import { useRef, useState } from "react";
import { useScoreStore } from "../lib/score/state";
import { useAudioTicks } from "./useAudioTick";
import { NotePlayed, Ticks } from "../lib/score/types";
import { calculateBeatTime } from "../lib/beat-time";
import { useInputListener } from "./useInputListener";
import { mappings } from "../mappings/roland-td07";
import { useInterval } from "usehooks-ts";
import { start } from "tone";
import { ResultProps } from "../Metronome/Result";
import { calculateResult } from "../lib/result-calculator";

export function useMetronome(onTick?: (index: number) => void) {
  const score = useScoreStore((state) => state.score);
  const scoreLength = score.flatMap((bars) =>
    bars.map((bar) => bar.notes),
  ).length;
  const configuration = useScoreStore((state) => state.configuration);
  const [started, setStarted] = useState(false);
  const ticksRef = useRef<Ticks>([]);
  const { bigTick, smallTick } = useAudioTicks();
  const indexRef = useRef<number>(-1);
  const { signature: notes, bpm: beats } = configuration;
  const beatTime = calculateBeatTime(beats, notes);
  const notesPlayedRef = useRef<NotePlayed[]>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);

  useInputListener((e) => {
    notesPlayedRef.current.push({
      timestamp: e.timestamp,
      note: mappings[e.note.number],
    });
  });

  const tick = async () => {
    indexRef.current = indexRef.current + 1;
    if (indexRef.current >= scoreLength) {
      indexRef.current = 0;
    }
    ticksRef.current.push(performance.now());
    const isBigTick =
      indexRef.current + 1 === 1 ||
      indexRef.current % configuration.signature === 0;
    if (isBigTick) {
      bigTick(beatTime);
    } else {
      smallTick(beatTime);
    }
    onTick?.(indexRef.current);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to fix this later
  useInterval(
    () => {
      tick();
    },
    started ? beatTime : null,
  );

  const toggle = () => {
    start();
    if (started) {
      setResult(
        calculateResult({
          ticks: ticksRef.current,
          notesPlayed: notesPlayedRef.current,
          score,
          graceTime: configuration.graceTime,
        }),
      );
    } else {
      notesPlayedRef.current = [];
      ticksRef.current = [];
      indexRef.current = -1;
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return { toggle, result, started };
}
