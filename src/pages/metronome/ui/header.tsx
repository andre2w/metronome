import {
  useScoreContext,
  useScoreStoreShallow,
} from "~/entities/score/model/state/score-store-provider";
import { MetronomeConfiguration } from "./metronome-configuration";
import { useRef, useState } from "react";
import { Result, ResultProps } from "./result";
import { useAudioTicks } from "./use-audio-tick";
import { useInputListener } from "~/entities/midi-input/ui/use-input-listener";
import { useScoreInterval } from "./use-score-interval";
import { start } from "tone";
import { calculateResult } from "../model/result-calculator";
import { Timer } from "./timer";
import styles from "./metronome.module.scss";

export function MetronomeHeader() {
  const { bpm, graceTime } = useScoreStoreShallow(({ metronome }) => ({
    bpm: metronome.bpm,
    graceTime: metronome.graceTime,
  }));
  const store = useScoreContext();

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
    void start();
    if (isToggled) {
      setResult(
        calculateResult({
          ticks: ticksRef.current,
          notesPlayed: getPlayedNotes(),
          score: store.getState().score,
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
    <section className={styles.metronome}>
      <div className={styles["metronome-row"]}>
        <div className={styles["metronome-panel"]}>
          <header className={styles["page-section-header"]}>Configuration</header>
          <MetronomeConfiguration />
        </div>

        <div className={styles["metronome-panel"]}>
          <header className={styles["page-section-header"]}>Transport</header>
          <div className={styles["metronome-controls"]}>
            <button
              type="button"
              className={styles["metronome-cta"]}
              data-state={isToggled ? "running" : "idle"}
              onClick={() => toggle()}
            >
              {isToggled ? "Stop" : "Start"}
            </button>
            <Timer />
          </div>
        </div>

        <div className={styles["metronome-panel"]}>
          <header className={styles["page-section-header"]}>Result</header>
          <Result right={result?.right ?? 0} missed={result?.missed ?? 0} />
        </div>
      </div>
    </section>
  );
}
