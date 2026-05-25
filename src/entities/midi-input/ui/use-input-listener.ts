import { useEffect, useRef } from "react";
import type { NoteMessageEvent } from "webmidi";
import type { NotePlayed } from "../../score/model/types";
import { mappings } from "../config/mappings/roland-td07";
import { useInputConfigurationContext } from "./input-configuration-context";

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
