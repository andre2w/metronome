import Dexie, { type EntityTable } from "dexie";
import type { SavedScore } from "./types";


export const db = new Dexie("Metronome") as Dexie & {
    scores: EntityTable<SavedScore>
};

db.version(1).stores({
    scores: "++id"
});