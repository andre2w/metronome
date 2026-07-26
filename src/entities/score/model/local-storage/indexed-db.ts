import Dexie, { type EntityTable } from "dexie";
import type { FullScore } from "../types";

export const db = new Dexie("metronome-storage") as Dexie & {
  scores: EntityTable<FullScore & { id: number }, "id">;
};

db.version(1).stores({
  scores: "++id",
});
