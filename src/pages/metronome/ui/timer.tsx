import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";

export function Timer() {
  const started = useScoreStore((state) => state.metronome.started);
  const [elapsed, setElapsed] = useState(0);
  if (!started && elapsed !== 0) {
    setElapsed(0);
  }

  useInterval(
    () => {
      setElapsed((elapsed) => elapsed + 1);
    },
    started ? 1000 : null,
  );

  const minutes = Math.ceil(elapsed > 60 ? elapsed / 60 : 0);
  const seconds = Math.ceil(elapsed > 60 ? elapsed % 60 : elapsed);

  return (
    <div className="metronome-timer">
      {formatToDoubleDigits(minutes)}:{formatToDoubleDigits(seconds)}
    </div>
  );
}

function formatToDoubleDigits(time: number) {
  return time >= 10 ? `${time}` : `0${time}`;
}
