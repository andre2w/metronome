import { useCallback, useMemo, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin.js";

export function useWaveform() {
  const waveSurferRef = useRef<WaveSurfer | undefined>(undefined);
  const plugins = useMemo(() => {
    return [
      ZoomPlugin.create({
        scale: 0.5,
        maxZoom: 1000,
      }),
      RegionsPlugin.create(),
    ] as const satisfies GenericPlugin[];
  }, []);

  const init = useCallback(
    (el: HTMLElement) => {
      const waveSurfer = WaveSurfer.create({
        container: el,
        waveColor: "#4F4A85",
        progressColor: "#383351",
        plugins,
      });

      waveSurferRef.current = waveSurfer;
      const regions = plugins[1];
      regions.enableDragSelection({
        color: "rgba(255, 0, 0, 0.1)",
      });
      regions.on("region-created", (event) => {
        console.log("region-created", event);
      });
      regions.on("region-in", (event) => {
        console.log("region-in", event);
      });
      regions.on("region-out", (event) => {
        console.log("region-out", event);
      });
      regions.on("region-double-clicked", (...args) => {
        console.log("region-double-clicked", args);
      });
      regions.on("region-clicked", (...args) => {
        console.log("region-clicked", args);
      });
    },
    [plugins],
  );

  const loadFile = useCallback(async (audio: string | Blob) => {
    if (!waveSurferRef.current) {
      throw new Error("WaveSurfer is not initialized yet");
    }

    if (typeof audio === "string") {
      await waveSurferRef.current.load(audio);
      return;
    }

    await waveSurferRef.current.loadBlob(audio);
  }, []);

  return { init, loadFile, isLoaded: !!waveSurferRef.current, waveSurferRef, regions: plugins[1] };
}
