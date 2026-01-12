import "./Metronome.css";
import { Button, Flex } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { VexflowScore, type VexflowScoreHandle } from "../Score/VexflowScore";
import { calculateBeatTime } from "../lib/beat-time";
import { calculateResult } from "../lib/result-calculator";
import type { NotePlayed, Ticks } from "../lib/score/types";
import { Result, type ResultProps } from "./Result";
import { Timer } from "./Timer";
import { useAudioTicks } from "../hooks/useAudioTick";
import { useInputListener } from "../hooks/useInputListener";
import { start } from "tone";
import { useInterval } from "usehooks-ts";
import { useScoreStore } from "../lib/score/state";
import { mappings } from "../mappings/roland-td07";

export interface MetronomeProps {
  className?: string;
}

export function Metronome({ className }: MetronomeProps) {
  const score = useScoreStore((state) => state.score);
  const scoreLength = score.flatMap((bars) =>
    bars.map((bar) => bar.notes),
  ).length;
  const configuration = useScoreStore((state) => state.configuration);
  const [started, setStarted] = useState(false);
  const vexflowScoreRef = useRef<VexflowScoreHandle>(null);
  const ticksRef = useRef<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { bigTick, smallTick } = useAudioTicks();
  const indexRef = useRef<number>(-1);
  const { signature: notes, bpm: beats } = configuration;
  const beatTime = calculateBeatTime(beats, notes);
  const notesPlayedRef = useRef<NotePlayed[]>([]);
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
    const isBigTick =
      indexRef.current + 1 === 1 ||
      indexRef.current % configuration.signature === 0;
    if (isBigTick) {
      bigTick(beatTime);
    } else {
      smallTick(beatTime);
    }
    ticksRef.current.push(performance.now());
    vexflowScoreRef.current?.setCursor(indexRef.current);
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
      vexflowScoreRef.current?.clearCursor();
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return (
    <>
      <div className={className}>
        <Flex justify="between">
          <Button onClick={() => toggle()}>{started ? "STOP" : "START"}</Button>
          <Timer started={started} />
        </Flex>
        {result && <Result right={result.right} missed={result.missed} />}
      </div>
      <VexflowScore ref={vexflowScoreRef} />
    </>
  );
}
