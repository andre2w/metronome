import Dexie, { type EntityTable } from "dexie";
import { Score } from "./score";

export const scoresDb = new Dexie("score-storage") as Dexie & {
  scores: EntityTable<Score & { id: number }, "id">;
};

scoresDb.version(1).stores({
  scores: "++id",
});
