import { useEffect, useRef } from "react";
import type { NoteMessageEvent } from "webmidi";
import { useInputConfigurationContext } from "../InputConfiguration/InputConfigurationContext";
import type { NotePlayed } from "../lib/types";
import { mappings } from "../mappings/roland-td07";

export function useInputListener() {
  const { selectedDevice: input } = useInputConfigurationContext();
  const notesPlayedRef = useRef<NotePlayed[]>([]);

  useEffect(() => {
    if (input) {
      const listener = (e: NoteMessageEvent) => {
        notesPlayedRef.current.push({
          timestamp: e.timestamp,
          note: mappings[e.note.number],
        });
      };
      input.addListener("noteon", listener);
      return () => {
        input.removeListener("noteon", listener);
      };
    }
  }, [input]);

  return {
    getPlayedNotes: () => notesPlayedRef.current,
    resetPlayedNotes: () => {
      notesPlayedRef.current = [];
    },
  };
}
