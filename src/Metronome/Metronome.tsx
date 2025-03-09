import type { Input, NoteMessageEvent } from "webmidi";
import "./Metronome.css";
import { Button, Flex } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { useScoreContext } from "../Score/ScoreProvider";
import { calculateBeatTime } from "../lib/beat-time";
import { calculateResult } from "../lib/result-calculator";
import type { NotePlayed, Ticks } from "../lib/types";
import { mappings } from "../mappings/roland-td07";
import { Result, type ResultProps } from "./Result";
import type { BaseMetronomeConfigurationProps } from "./configuration";

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
      tickSymbolsRef.current?.children
        .item(selectedRef.current)
        ?.classList.remove("selected");
      selectedRef.current =
        selectedRef.current + 1 >= notes ? 0 : selectedRef.current + 1;
      tickSymbolsRef.current?.children
        .item(selectedRef.current)
        ?.classList.add("selected");
      if (selectedRef.current % (configuration.notes / 4) === 0) {
        bigTick.current?.play();
      } else {
        smallTick.current?.play();
      }
      ticksRef.current.push(performance.now());
    };

    if (oldInterval) {
      clearInterval(oldInterval);
      intervalRef.current = undefined;
    }
    if (started) {
      tick();

      intervalRef.current = setInterval(tick, beatTime);
    } else {
      tickSymbolsRef.current?.children
        .item(selectedRef.current)
        ?.classList.remove("selected");
    }
  }, [started, configuration, score]);

  useEffect(() => {
    if (input) {
      const listener = (e: NoteMessageEvent) => {
        notesPlayedRef.current.push({
          timestamp: e.timestamp,
          note: mappings[e.note.number],
        });
      };
      input.addListener("noteon", listener);
      return () => {
        input.removeListener("noteon", listener);
      };
    }
  }, [input]);

  const toggle = () => {
    if (started) {
      setResult(
        calculateResult({
          ticks: ticksRef.current,
          notesPlayed: notesPlayedRef.current,
          score,
          graceTime: configuration.graceTime,
        }),
      );
    } else {
      notesPlayedRef.current = [];
      ticksRef.current = [];
      selectedRef.current = -1;
      setResult(undefined);
    }
    setStarted((v) => !v);
  };

  return (
    <div className={className}>
      <Button onClick={() => toggle()}>{started ? "STOP" : "START"}</Button>
      <Flex justify="between" gap="2" ref={tickSymbolsRef}> 
        {Array.from({ length: configuration.notes }).map((_, index) => {
          return (
            // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
            <div
              className={`metronome-tick ${index % (configuration.notes / 4) === 0 ? "metronome-tick-big" : "metronome-tick-small"}`}
            />
          );
        })}
      </Flex>
      {result && <Result right={result.right} missed={result.missed} />}
    </div>
  );
}
