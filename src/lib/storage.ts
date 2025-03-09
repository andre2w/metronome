import Dexie, { type EntityTable } from "dexie";
import type { SavedScore } from "./types";


export const db = new Dexie("Metronome") as Dexie & {
    scores: EntityTable<SavedScore & { id: number }, "id">
};

db.version(1).stores({
    scores: "++id"
});