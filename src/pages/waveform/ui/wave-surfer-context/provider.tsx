import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import { WaveSurferContext } from "./context";
import type { GenericPlugin } from "wavesurfer.js/dist/base-plugin.js";
import WaveSurfer from "wavesurfer.js";
import { getRgbaColorString } from "~/shared/lib/color";

export interface WaveSurferProviderProps {
  children: ReactNode;
}
export function WaveSurferProvider({ children }: WaveSurferProviderProps) {
  const waveSurferRef = useRef<WaveSurfer | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
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
      const waveColor = getRgbaColorString(el);
      const waveSurfer = WaveSurfer.create({
        container: el,
        waveColor: waveColor,
        progressColor: "#383351",
        plugins,
      });

      waveSurferRef.current = waveSurfer;

      const regions = plugins[1];
      regions.enableDragSelection({
        color: "rgba(255, 0, 0, 0.1)",
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
    setIsLoaded(true);
  }, []);

  const playPause = useCallback(async () => {
    await waveSurferRef.current?.playPause();
  }, []);

  return (
    <WaveSurferContext.Provider
      value={{
        init,
        loadFile,
        isLoaded,
        playPause,
        waveSurferRef: waveSurferRef,
        regions: plugins[1],
      }}
    >
      {children}
    </WaveSurferContext.Provider>
  );
}
