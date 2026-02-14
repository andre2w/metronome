import { useRef, useState } from "react";
import { useScoreStore } from "../lib/score/state";
import { useAudioTicks } from "./use-audio-ticks";
import type { NotePlayed, Ticks } from "../lib/score/types";
import { useInputListener } from "./use-input-listener";
import { mappings } from "../lib/mappings/roland-td07";
import { useInterval } from "usehooks-ts";
import { start } from "tone";
import type { ResultProps } from "../components/metronome/result";
import { calculateResult, isNoteRight } from "../lib/result-calculator";
import { useMetronomeStore } from "../lib/metronome-store";
import { useShallow } from "zustand/shallow";

export function useMetronome(onTick?: (index: number) => void) {
  const score = useScoreStore((state) => state.score);
  const flatScore = score.flatMap((bars) => bars.map((bar) => bar.notes));
  const scoreLength = flatScore.length;

  const { beatTime, graceTime, signature } = useMetronomeStore(
    useShallow((state) => ({
      beatTime: state.beatTime,
      graceTime: state.graceTime,
      signature: state.signature,
      onUpdate: state.onUpdate,
    })),
  );

  const [started, setStarted] = useState(false);
  const ticksRef = useRef<Ticks>([]);
  const { bigTick, smallTick } = useAudioTicks();
  const indexRef = useRef<number>(-1);
  const notesPlayedRef = useRef<NotePlayed[]>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const windowRef = useRef<number[]>([]);
  const countRef = useRef<number>(0);

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
      indexRef.current + 1 === 1 || indexRef.current % signature === 0;

    if (isBigTick) {
      bigTick(beatTime);
    } else {
      smallTick(beatTime);
    }

    onTick?.(indexRef.current);
    windowRef.current.push(notesPlayedRef.current.length);
    const noteResult = isNoteRight({
      tick: ticksRef.current[ticksRef.current.length - 2],
      graceTime: graceTime,
      notes: flatScore[indexRef.current],
      notesPlayed: notesPlayedRef.current,
      notesRange: {
        start: windowRef.current[windowRef.current.length - 2],
        end: windowRef.current[windowRef.current.length - 1],
      },
    });

    if (noteResult) {
      countRef.current = countRef.current + 1;
    }
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
          graceTime,
        }),
      );
    } else {
      notesPlayedRef.current = [];
      ticksRef.current = [];
      indexRef.current = -1;
      windowRef.current = [];
      countRef.current = 0;
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return { toggle, result, started };
}
