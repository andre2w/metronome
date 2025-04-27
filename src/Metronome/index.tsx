import "./Metronome.css";
import { Button } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { useScoreContext } from "../Score/ScoreProvider";
import { VexflowScore, type VexflowScoreHandle } from "../Score/VexflowScore";
import { calculateBeatTime } from "../lib/beat-time";
import { calculateResult } from "../lib/result-calculator";
import type { Ticks } from "../lib/types";
import { Result, type ResultProps } from "./Result";
import { Ticks as TicksComponent, type TicksHandle } from "./components/Ticks";
import { useAudioTicks } from "./useAudioTick";
import { useInputListener } from "./useInputListener";

export interface MetronomeProps {
  className?: string;
}

export function Metronome({ className }: MetronomeProps) {
  const [started, setStarted] = useState(false);
  const selectedRef = useRef<number>(-1);
  const vexflowScoreRef = useRef<VexflowScoreHandle>(null);
  const ticksRef = useRef<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { score, configuration } = useScoreContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const tickSymbolsRef = useRef<TicksHandle | null>(null);
  const { playNextTick, reset: resetAudioTicks } = useAudioTicks({
    notes: configuration.signature,
  });
  const { getPlayedNotes, resetPlayedNotes } = useInputListener();

  const tick = async () => {
    tickSymbolsRef.current?.next();
    await playNextTick();
    ticksRef.current.push(performance.now());
    vexflowScoreRef.current?.next();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to fix this later
  useEffect(() => {
    const { signature: notes, bpm: beats } = configuration;
    const beatTime = calculateBeatTime(beats, notes);
    const oldInterval = intervalRef.current;

    if (oldInterval) {
      clearInterval(oldInterval);
      intervalRef.current = undefined;
    }
    if (started) {
      vexflowScoreRef.current?.showCursor();
      tick();

      intervalRef.current = setInterval(tick, beatTime);
    } else {
      tickSymbolsRef.current?.clear();
      vexflowScoreRef.current?.hideCursor();
      resetAudioTicks();
    }
  }, [started, configuration, score]);

  const toggle = () => {
    if (started) {
      setResult(
        calculateResult({
          ticks: ticksRef.current,
          notesPlayed: getPlayedNotes(),
          score,
          graceTime: configuration.graceTime,
        }),
      );
    } else {
      resetPlayedNotes();
      ticksRef.current = [];
      selectedRef.current = -1;
      tickSymbolsRef.current?.clear();
      resetAudioTicks();
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return (
    <>
      <div className={className}>
        <Button
          onClick={() => toggle()}
          style={{ marginBottom: "var(--space-2)" }}
        >
          {started ? "STOP" : "START"}
        </Button>
        <TicksComponent ref={tickSymbolsRef} notes={configuration.signature} />
        {result && <Result right={result.right} missed={result.missed} />}
      </div>
      <VexflowScore score={score} ref={vexflowScoreRef} />
    </>
  );
}
