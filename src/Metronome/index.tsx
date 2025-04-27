import "./Metronome.css";
import { Button } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { useScoreContext } from "../Score/ScoreProvider";
import { calculateBeatTime } from "../lib/beat-time";
import { calculateResult } from "../lib/result-calculator";
import type { Ticks } from "../lib/types";
import { Result, type ResultProps } from "./Result";
import { Ticks as TicksComponent, type TicksHandle } from "./components/Ticks";
import type { BaseMetronomeConfigurationProps } from "./configuration";
import { useAudioTicks } from "./useAudioTick";
import { useInputListener } from "./useInputListener";

export interface MetronomeProps {
  configuration: BaseMetronomeConfigurationProps;
  className?: string;
}

export function Metronome({ className, configuration }: MetronomeProps) {
  const [started, setStarted] = useState(false);
  const selectedRef = useRef<number>(-1);

  const ticksRef = useRef<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { score } = useScoreContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();

  const tickSymbolsRef = useRef<TicksHandle | null>(null);
  const selectedStaveRef = useRef<number>(0);
  const scoreStaveRef = useRef<number>(0);
  const flatScore = score.flat().map((n) => n.notes);
  const { playNextTick, reset: resetAudioTicks } = useAudioTicks({
    notes: configuration.notes,
  });
  const { getPlayedNotes, resetPlayedNotes } = useInputListener();

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want the side effect that the rule complains about
  useEffect(() => {
    if (started && selectedRef.current > configuration.notes) {
      selectedRef.current = Math.floor(
        selectedRef.current % configuration.notes,
      );
    }
  }, [configuration.notes]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to fix this later
  useEffect(() => {
    const { notes, beats } = configuration;
    const beatTime = calculateBeatTime(beats, notes);
    const oldInterval = intervalRef.current;

    const tick = () => {
      tickSymbolsRef.current?.next();
      playNextTick();
      ticksRef.current.push(performance.now());

      const cursor = document.querySelector<HTMLImageElement>("#cursor");
      const staves = document.querySelectorAll<HTMLElement>(".vf-stavenote");
      if (!cursor) {
        return;
      }

      if (!staves.length) {
        return;
      }

      if (selectedStaveRef.current >= (staves.length ?? 0)) {
        selectedStaveRef.current = 0;
      }

      if (scoreStaveRef.current >= flatScore.length) {
        scoreStaveRef.current = 0;
      }

      if (!flatScore.at(scoreStaveRef.current)?.length) {
        cursor.style.visibility = "hidden";
        scoreStaveRef.current++;
        return;
      }

      const rect = staves
        .item(selectedStaveRef.current)
        ?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      cursor.style.top = `${rect.top}px`;
      cursor.style.left = `${rect.left}px`;
      cursor.style.width = `${rect.width}px`;
      cursor.style.height = `${rect.height}px`;
      cursor.style.visibility = "visible";
      selectedStaveRef.current++;
      scoreStaveRef.current++;
    };

    if (oldInterval) {
      clearInterval(oldInterval);
      intervalRef.current = undefined;
    }
    if (started) {
      tick();

      intervalRef.current = setInterval(tick, beatTime);
    } else {
      tickSymbolsRef.current?.clear();
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
      selectedStaveRef.current = 0;
      scoreStaveRef.current = 0;
      tickSymbolsRef.current?.clear();
      resetAudioTicks();
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return (
    <div className={className}>
      <Button
        onClick={() => toggle()}
        style={{ marginBottom: "var(--space-2)" }}
      >
        {started ? "STOP" : "START"}
      </Button>
      <TicksComponent ref={tickSymbolsRef} notes={configuration.notes} />
      {result && <Result right={result.right} missed={result.missed} />}
    </div>
  );
}
