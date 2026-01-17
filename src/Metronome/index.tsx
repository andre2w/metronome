import "./Metronome.css";
import { Button, Flex } from "@radix-ui/themes";
import { useRef, useState } from "react";
import { VexflowScore, type VexflowScoreHandle } from "../Score/VexflowScore";
import { calculateBeatTime } from "../lib/beat-time";
import { calculateResult } from "../lib/result-calculator";
import type { NotePlayed, Ticks } from "../lib/score/types";
import { Result, type ResultProps } from "./Result";
import { Timer } from "./Timer";
import { useAudioTicks } from "../hooks/useAudioTick";
import { useInputListener } from "../hooks/useInputListener";
import { start } from "tone";
import { useInterval } from "usehooks-ts";
import { useScoreStore } from "../lib/score/state";
import { mappings } from "../mappings/roland-td07";
import { useMetronome } from "../hooks/useMetronome";

export interface MetronomeProps {
  className?: string;
}

export function Metronome({ className }: MetronomeProps) {
  const vexflowScoreRef = useRef<VexflowScoreHandle>(null);
  const { toggle, result, started } = useMetronome((index) => {
    vexflowScoreRef.current?.setCursor(index);
  });

  return (
    <>
      <div className={className}>
        <Flex justify="between">
          <Button onClick={() => toggle()}>{started ? "STOP" : "START"}</Button>
          <Timer started={started} />
        </Flex>
        {result && <Result right={result.right} missed={result.missed} />}
      </div>
      <VexflowScore ref={vexflowScoreRef} />
    </>
  );
}
