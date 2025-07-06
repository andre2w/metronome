import { useState } from "react";
import { useInterval } from "usehooks-ts";

export interface TimerProps {
  started: boolean;
}

export function Timer({ started }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);
  if (!started && elapsed !== 0) {
    setElapsed(0);
  }

  useInterval(() => {
    setElapsed(elapsed => elapsed + 1);
  }, started ? 1000 : null);

  const minutes = elapsed > 60 ?  elapsed / 60 : 0;
  const seconds = elapsed > 60 ? elapsed % 60 : elapsed;

  return <div>{formatToDoubleDigits(minutes)}:{formatToDoubleDigits(seconds)}</div>
}

function formatToDoubleDigits(time: number) {
  return time >= 10 ? `${time}` : `0${time}`;
}
