import { Input } from "webmidi";
import "./Metronome.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaseMetronomeConfigurationProps } from "./configuration";
import { Result, ResultProps } from "./Result";
import { NotePlayed, Ticks } from "../lib/types";
import { calculateResult } from "../lib/result-calculator";
import { calculateBeatTime } from "../lib/beat-time";
import { mappings } from "../mappings/roland-td07";
import { useScoreContext } from "../Score/ScoreProvider";
import { Button } from "@radix-ui/themes";

export interface MetronomeProps {
  configuration: BaseMetronomeConfigurationProps;
  input?: Input;
  className?: string;
}

export function Metronome({ className, input, configuration }: MetronomeProps) {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(0);
  const [played, setPlayed] = useState<NotePlayed[]>([]);
  const [ticks, setTicks] = useState<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { score } = useScoreContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const bigTick = useRef<HTMLAudioElement | undefined>();
  const smallTick = useRef<HTMLAudioElement | undefined>();

  useEffect(() => {
    bigTick.current = new Audio("/metronome1Count.mp3");
    smallTick.current = new Audio("/metronomeClick.mp3");
  }, []);

  if (started && selected > configuration.notes) {
    setSelected(Math.floor(selected % configuration.notes));
  }

  useEffect(() => {
    const { notes, beats } = configuration;
    const beatTime = calculateBeatTime(beats, notes);
    const oldInterval = intervalRef.current;
    if (oldInterval) {
      clearInterval(oldInterval);
      intervalRef.current = undefined;
    }
    if (started) { 
      intervalRef.current = setInterval(() => {
        console.log("Interval called");
        setSelected(val => {
          const newVal = val + 1;
          if (newVal % (configuration.notes / 4 ) === 0) {
            bigTick.current?.play(); 
          } else {
            smallTick.current?.play();
          };
          return newVal >= notes ? 0 : newVal;
        });
        setTicks(t => [...t, Date.now()]);
      }, beatTime);
    }
  }, [started, configuration, score]);

  useEffect(() => {
    if (input) {
      input.addListener("noteon", (e) => {
        setPlayed(p => [...p, { timestamp: Date.now(), note: mappings[e.note.number] }]);
      });
      return () => {
        input.removeListener("noteon");
      }
    }
  }, [input, setPlayed]);

  const toggle = useCallback(() => {
    if (started) {
      setResult(calculateResult({
        ticks, notesPlayed: played, score, graceTime: configuration.graceTime
      }));
    } else {
      setPlayed([]);
      setTicks([]);
      setSelected(0);
      setResult(undefined);
    }
    setStarted(v => !v);
  }, [score, configuration.graceTime]);

  return <div className={className}>
    <Button onClick={() => toggle()}>{started ? "STOP": "START"}</Button>
    <div style={{ display: "flex", justifyContent: "space-evenly"}}>
      {Array.from({ length: configuration.notes }).map((_, index) => {
        return <div className={`${index % (configuration.notes / 4) === 0 ? "metronome-big" : "metronome-small"} ${started && index === selected ? "selected" : ""}`}></div>
      })}
    </div>
    {result && <Result right={result.right} missed={result.missed} />}
  </div>
}
