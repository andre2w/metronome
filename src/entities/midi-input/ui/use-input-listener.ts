import { useEffect, useRef } from "react";
import type { NoteMessageEvent } from "webmidi";
import { useInputConfigurationContext } from "./input-configuration-context";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { NotePlayed } from "~/shared/lib/score/note-played";

export function useInputListener() {
  const { selectedDevice: input } = useInputConfigurationContext();
  const notesPlayedRef = useRef<NotePlayed[]>([]);
  const configuration = useConfiguration();

  useEffect(() => {
    if (input) {
      const listener = (e: NoteMessageEvent) => {
        const notePlayed = configuration.getKeyFromMidiInput(e.note.number);
        if (notePlayed) {
          notesPlayedRef.current.push({
            timestamp: e.timestamp,
            note: notePlayed,
          });
        } else {
          console.warn("Played something without a registered note", e.note.number);
        }
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
