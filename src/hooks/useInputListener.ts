import { useEffect } from "react";
import type { NoteMessageEvent } from "webmidi";
import { useInputConfigurationContext } from "../components/InputConfiguration/InputConfigurationContext";

export function useInputListener(onNote: (e: NoteMessageEvent) => void) {
  const { selectedDevice: input } = useInputConfigurationContext();

  useEffect(() => {
    if (input) {
      input.addListener("noteon", onNote);
      return () => {
        input.removeListener("noteon", onNote);
      };
    }
  }, [input]);
}
