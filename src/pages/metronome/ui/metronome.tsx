import "./metronome.css";
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
import { MetronomeConfiguration } from "./metronome-configuration";

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
      <section className={`metronome ${className ?? ""}`}>
        <div className="metronome-row">
          <div className="metronome-panel metronome-panel-config">
            <header className="page-section-header">Configuration</header>
            <MetronomeConfiguration />
          </div>

          <div className="metronome-panel metronome-panel-transport">
            <header className="page-section-header">Transport</header>
            <div className="metronome-controls">
              <button
                type="button"
                className="metronome-cta"
                data-state={started ? "running" : "idle"}
                onClick={() => toggle()}
              >
                {started ? "Stop" : "Start"}
              </button>
              <Timer started={started} />
            </div>
          </div>

          <div className="metronome-panel metronome-panel-result">
            <header className="page-section-header">Result</header>
            <Result right={result?.right ?? 0} missed={result?.missed ?? 0} />
          </div>
        </div>
      </section>
      <SheetRenderer ref={vexflowScoreRef} />
      <SheetControls />
    </>
  );
}
