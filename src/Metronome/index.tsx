import "./Metronome.css";
import { Button, Flex } from "@radix-ui/themes";
import { useRef } from "react";
import { VexflowScore, type VexflowScoreHandle } from "../Score/VexflowScore";
import { Result } from "./Result";
import { Timer } from "./Timer";
import { useMetronome } from "../hooks/useMetronome";
import { MetronomeConfiguration } from "../components/metronome/metronome-configuration";

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
          <MetronomeConfiguration />
          <Timer started={started} />
        </Flex>
        {result && <Result right={result.right} missed={result.missed} />}
      </div>
      <VexflowScore ref={vexflowScoreRef} />
    </>
  );
}
