import "./metronome.css";
import { Button, Flex } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { calculateBeatTime } from "../model/beat-time";
import { calculateResult } from "../model/result-calculator";
import type { Ticks } from "../../../entities/score/model/types";
import { Result, type ResultProps } from "./result";
import { Timer } from "./timer";
import type { TicksHandle } from "./ticks";
import { useAudioTicks } from "./use-audio-tick";
import { useInputListener } from "../../../entities/midi-input/ui/use-input-listener";
import { start } from "tone";
import { useInterval } from "usehooks-ts";
import { SheetRenderer } from "~/widgets/sheet-renderer";
import { VexflowScoreHandle } from "~/widgets/sheet-renderer/ui/sheet-renderer";
import { SheetControls } from "~/widgets/sheet-controls";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";

export interface MetronomeProps {
  className?: string;
}

export function Metronome({ className }: MetronomeProps) {
  const { score, configuration } = useScoreStoreShallow(({ score, configuration }) => ({
    score,
    configuration,
  }));
  const [started, setStarted] = useState(false);
  const selectedRef = useRef<number>(-1);
  const vexflowScoreRef = useRef<VexflowScoreHandle>(null);
  const ticksRef = useRef<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const tickSymbolsRef = useRef<TicksHandle | null>(null);
  const { playNextTick: playNextAudioTick, reset: resetAudioTicks } = useAudioTicks({
    notes: configuration.signature,
    bpm: configuration.bpm,
  });
  const { getPlayedNotes, resetPlayedNotes } = useInputListener();

  const tick = async () => {
    await playNextAudioTick();
    tickSymbolsRef.current?.next();
    ticksRef.current.push(performance.now());
    vexflowScoreRef.current?.next();
  };

  const { signature: notes, bpm: beats } = configuration;
  const beatTime = calculateBeatTime(beats, notes);

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
      vexflowScoreRef.current?.reset();
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return (
    <>
      <div className={className}>
        {/* style={{ marginBottom: "var(--space-2)" }} */}
        <Flex justify="between">
          <Button onClick={() => toggle()}>{started ? "STOP" : "START"}</Button>
          <Timer started={started} />
        </Flex>

        {result && <Result right={result.right} missed={result.missed} />}
      </div>
      <SheetRenderer ref={vexflowScoreRef} />
      <SheetControls />
    </>
  );
}
