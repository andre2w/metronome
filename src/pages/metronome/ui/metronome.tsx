import "./metronome.css";
import { useRef, useState } from "react";
import { calculateResult } from "../model/result-calculator";
import { Result, type ResultProps } from "./result";
import { Timer } from "./timer";
import { useAudioTicks } from "./use-audio-tick";
import { useInputListener } from "../../../entities/midi-input/ui/use-input-listener";
import { start } from "tone";
import { SheetRenderer } from "~/widgets/sheet-renderer";
import { SheetControls } from "~/widgets/sheet-controls";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { MetronomeConfiguration } from "./metronome-configuration";
import { useScoreInterval } from "./use-score-interval";

export interface MetronomeProps {
  className?: string;
}

export function Metronome({ className }: MetronomeProps) {
  const { score, bpm, graceTime } = useScoreStoreShallow(({ metronome, score }) => ({
    score,
    bpm: metronome.bpm,
    graceTime: metronome.graceTime,
  }));

  const ticksRef = useRef<number[]>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { playNextTick: playNextAudioTick } = useAudioTicks({
    notes: 4,
    bpm: bpm,
  });
  const { getPlayedNotes, resetPlayedNotes } = useInputListener();

  const tick = async () => {
    await playNextAudioTick();
    ticksRef.current.push(performance.now());
  };
  const { isToggled, toggle: startStop } = useScoreInterval({ onTick: tick });

  const toggle = () => {
    start();
    if (isToggled) {
      setResult(
        calculateResult({
          ticks: ticksRef.current,
          notesPlayed: getPlayedNotes(),
          score,
          graceTime,
        }),
      );
    } else {
      resetPlayedNotes();
      ticksRef.current = [];
      setResult(undefined);
    }
    startStop();
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
                data-state={isToggled ? "running" : "idle"}
                onClick={() => toggle()}
              >
                {isToggled ? "Stop" : "Start"}
              </button>
              <Timer />
            </div>
          </div>

          <div className="metronome-panel metronome-panel-result">
            <header className="page-section-header">Result</header>
            <Result right={result?.right ?? 0} missed={result?.missed ?? 0} />
          </div>
        </div>
      </section>
      <SheetRenderer />
      <SheetControls />
    </>
  );
}
