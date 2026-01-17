import { Button, Flex } from "@radix-ui/themes";
import { Result } from "./result";
import { Timer } from "./timer";
import { useMetronome } from "../../hooks/use-metronome";
import { MetronomeConfiguration } from "./metronome-configuration";

export interface MetronomeProps {
  className?: string;
  onTick?: (index: number) => void;
}

export function Metronome({ className, onTick }: MetronomeProps) {
  const { toggle, result, started } = useMetronome((index) => {
    onTick?.(index);
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
    </>
  );
}
