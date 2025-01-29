import { Input, NoteMessageEvent } from "webmidi";
import "./Metronome.css";
import { useEffect, useRef, useState } from "react";
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
  const selectedRef = useRef<number>(-1);
  const notesPlayedRef = useRef<NotePlayed[]>([]);
  const ticksRef = useRef<Ticks>([]);
  const [result, setResult] = useState<ResultProps | undefined>(undefined);
  const { score } = useScoreContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const bigTick = useRef<HTMLAudioElement | undefined>();
  const smallTick = useRef<HTMLAudioElement | undefined>();
  const tickSymbolsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bigTick.current = new Audio("/metronome1Count.mp3");
    smallTick.current = new Audio("/metronomeClick.mp3");    
  }, []);

  useEffect(() => {
    if (started && selectedRef.current > configuration.notes) {
      selectedRef.current = Math.floor(selectedRef.current % configuration.notes)
    }
  }, [configuration.notes])


  useEffect(() => {
    const { notes, beats } = configuration;
    const beatTime = calculateBeatTime(beats, notes);
    const oldInterval = intervalRef.current;
    if (oldInterval) {
      clearInterval(oldInterval);
      intervalRef.current = undefined;
    }
    if (started) { 
        tickSymbolsRef.current?.children.item(selectedRef.current)?.classList.remove("selected");
        selectedRef.current = selectedRef.current + 1 >= notes ? 0 : selectedRef.current + 1;
        tickSymbolsRef.current?.children.item(selectedRef.current)?.classList.add("selected");
        if (selectedRef.current % (configuration.notes / 4 ) === 0) {
          bigTick.current?.play(); 
        } else {
          smallTick.current?.play();
        };
        ticksRef.current.push(performance.now());

      intervalRef.current = setInterval(() => {
        tickSymbolsRef.current?.children.item(selectedRef.current)?.classList.remove("selected");
        selectedRef.current = selectedRef.current + 1 >= notes ? 0 : selectedRef.current + 1;
        tickSymbolsRef.current?.children.item(selectedRef.current)?.classList.add("selected");
        if (selectedRef.current % (configuration.notes / 4 ) === 0) {
          bigTick.current?.play(); 
        } else {
          smallTick.current?.play();
        };
        ticksRef.current.push(performance.now());
      }, beatTime);
    } else {
      tickSymbolsRef.current?.children.item(selectedRef.current)?.classList.remove("selected"); 
    }
  }, [started, configuration, score]);

  useEffect(() => {
    if (input) {
      const listener = (e: NoteMessageEvent) => {
        notesPlayedRef.current.push({ timestamp: e.timestamp, note: mappings[e.note.number] });
      };
      input.addListener("noteon", listener);
      return () => {
        input.removeListener("noteon", listener);
      }
    }
  }, [input]);

  const toggle = () => {
    if (started) {
      setResult(calculateResult({
        ticks: ticksRef.current, notesPlayed: notesPlayedRef.current, score, graceTime: configuration.graceTime
      }));
    } else {
      notesPlayedRef.current = [];
      ticksRef.current = [];
      selectedRef.current = -1;
      setResult(undefined);
    }
    setStarted(v => !v);
  };

  return <div className={className}>
    <Button onClick={() => toggle()}>{started ? "STOP": "START"}</Button>
    <div style={{ display: "flex", justifyContent: "space-evenly"}} ref={tickSymbolsRef}>
      {Array.from({ length: configuration.notes }).map((_, index) => {
        return <div className={`${index % (configuration.notes / 4) === 0 ? "metronome-big" : "metronome-small"}`}></div>
      })}
    </div>
    {result && <Result right={result.right} missed={result.missed} />}
  </div>
}
