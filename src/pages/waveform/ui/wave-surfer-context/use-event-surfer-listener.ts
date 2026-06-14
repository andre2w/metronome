import { useEffect } from "react";
import { useWaveSurfer } from "./use-wave-surfer";
import { WaveSurferEvents } from "wavesurfer.js/dist/types.js";

export function useEventSurferListener<Event extends keyof WaveSurferEvents>(
  event: Event,
  listener: (...args: WaveSurferEvents[Event]) => void,
) {
  const { waveSurferRef } = useWaveSurfer();
  useEffect(() => {
    if (!waveSurferRef.current) {
      return;
    }
    return waveSurferRef.current.on(event, listener);
  }, [waveSurferRef]);
}
