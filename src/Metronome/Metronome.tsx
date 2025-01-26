import { Input } from "webmidi";
import "./Metronome.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { MetronomeConfiguration } from "./MetronomeConfiguration";
import { BaseMetronomeConfigurationProps } from "./configuration";
import { Result, ResultProps } from "./Result";
import { NotePlayed, Ticks } from "../lib/types";
import { calculateResult } from "../lib/result-calculator";
import { calculateBeatTime } from "../lib/beat-time";
import { mappings } from "../mappings/roland-td07";
import { useScoreContext } from "../Score/ScoreProvider";

export interface MetronomeProps {
  configuration: BaseMetronomeConfigurationProps;
  onChangeConfiguration: (configuration: BaseMetronomeConfigurationProps) => void;
  input?: Input;
  className?: string;
}

export function Metronome({ className, input, configuration, onChangeConfiguration }: MetronomeProps) {
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
    if (started) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
