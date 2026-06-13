import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useWaveform } from "./use-waveform";
import { calculateBeatTime } from "~/pages/metronome/model/beat-time";

// Give regions a random color when they are created
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

export function WaveformView() {
  const { init, loadFile, isLoaded, waveSurferRef, regions } = useWaveform();
  const [displayControls, setDisplayControls] = useState(false);

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key === "m" && waveSurferRef.current) {
        const currentTime = waveSurferRef.current.getCurrentTime();
        console.log(currentTime);
        regions.addRegion({
          start: currentTime,
          content: "Marker",
          color: randomColor(),
        });
      }
    };
    window.addEventListener("keypress", handler);

    return () => {
      window.removeEventListener("keypress", handler);
    };
  }, []);

  const onLoadFile = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size > 0) {
        loadFile(file).then(() => {
          setDisplayControls(true);
          if (waveSurferRef.current) {
            const waveSurfer = waveSurferRef.current;
            const beat = calculateBeatTime(117, 8) / 1000;
            const duration = waveSurfer.getDuration();
            let start = 7.9;
            let index = 1;
            console.log({ beat, start });
            while (start < duration) {
              regions.addRegion({
                start,
                end: start + beat,
                color: randomColor(),
                content: `${index}`,
              });
              start = start + beat;
            }
          }
        });
      }
    },
    [setDisplayControls, loadFile],
  );

  return (
    <div>
      <div>
        <input type="file" onChange={onLoadFile} />
      </div>
      <div>
        <button
          onClick={async () => {
            await waveSurferRef.current?.playPause();
          }}
        >
          Toggle
        </button>
      </div>
      <div
        ref={(el) => {
          if (el && !isLoaded) {
            init(el);
          }
        }}
      />
    </div>
  );
}
