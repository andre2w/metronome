import { useEffect, useState } from "react";
import { WebMidi } from "webmidi";

export type WebMidiApi = Awaited<ReturnType<typeof createWebMidi>>;

export function useWebMidi() {
  const [webmidi, setWebMidi] = useState<WebMidiApi | undefined>(undefined);

  const enable = async () => {
    const webmidi = await createWebMidi();
    setWebMidi(webmidi);
  }

  return {
    enable,
    webmidi,
  };
}

function createWebMidi() {
  return WebMidi.enable();
}
