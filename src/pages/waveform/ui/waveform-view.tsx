import { useEffect, useRef, useState } from "react";
import { useWaveform } from "./use-waveform";

export function WaveformView() {
  const { init, loadFile, isLoaded, waveSurferRef } = useWaveform();
  const [displayControls, setDisplayControls] = useState(false);

  return (
    <div>
      <div>
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 0) {
              await loadFile(file);
              setDisplayControls(true);
            }
          }}
        />
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
