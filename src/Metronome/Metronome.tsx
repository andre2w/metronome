import { Input } from "webmidi";
import "./Metronome.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { MetronomeConfiguration } from "./MetronomeConfiguration";
import { BaseMetronomeConfigurationProps } from "./configuration";
import { Result, ResultProps } from "./Result";
import { NotePlayed, Score, Ticks } from "../lib/types";
import { calculateResult } from "../lib/result-calculator";
import { calculateBeatTime } from "../lib/beat-time";
import { mappings } from "../mappings/roland-td07";

export interface MetronomeProps {
  configuration: BaseMetronomeConfigurationProps;
  onChangeConfiguration: (configuration: BaseMetronomeConfigurationProps) => void;
  input?: Input;
  className?: string;
  score: Score;
}

export function Metronome({ className, input, configuration, onChangeConfiguration, score }: MetronomeProps) {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState(0);
  const [played, setPlayed] = useState<NotePlayed[]>([]);
  const [ticks, setTicks] = useState<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const intervalRef = useRef<any>();

  if (started && selected > configuration.notes) {
    setSelected(Math.floor(selected % configuration.notes));
  }

  useEffect(() => {
    const { notes, beats } = configuration;
    const beatTime = calculateBeatTime(beats, notes);
    if (started) {
      intervalRef.current = setInterval(() => {
        setSelected(val => {
          const newVal = val + 1;
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
    console.log("Toggle", started);
    if (started) {
      if (intervalRef.current) {
        console.log("Will clear interval", started);
        clearInterval(intervalRef.current);
      }
      console.log({
        ticks, notesPlayed: played, score, graceTime: configuration.graceTime
      });
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
    <MetronomeConfiguration configuration={configuration} onChange={onChangeConfiguration} started={started} toggle={toggle} />
    <div style={{ display: "flex", justifyContent: "space-evenly"}}>
      {Array.from({ length: configuration.notes }).map((_, index) => {
        return <div className={`${index % (configuration.notes / 4) === 0 ? "metronome-big" : "metronome-small"} ${started && index === selected ? "selected" : ""}`}></div>
      })}
    </div>
    {result && <Result right={result.right} missed={result.missed} />}
  </div>
}
