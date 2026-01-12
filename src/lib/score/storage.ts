import Dexie, { type EntityTable } from "dexie";
import type { FullScore } from "./types";

export const db = new Dexie("Metronome") as Dexie & {
  scores: EntityTable<FullScore & { id: number }, "id">;
};

db.version(1).stores({
  scores: "++id",
});

db.version(2)
  .stores({
    scores: "++id",
  })
  .upgrade((txn) => {
    return txn
      .table("scores")
      .toCollection()
      .modify((score) => {
        score.bpm = score.beats;
        score.signature = score.notes;
        // biome-ignore lint/performance/noDelete: <explanation>
        delete score.beats;
        // biome-ignore lint/performance/noDelete: <explanation>
        delete score.signature;
      });
  });
