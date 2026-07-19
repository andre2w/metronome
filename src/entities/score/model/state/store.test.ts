import { describe, expect, test } from "vitest";
import { createScoreStore } from "./store";
import { Part, Tempo } from "../types";
import { StateStorage } from "zustand/middleware";
import { InitialState } from "./initial-state";

const initialState = {
  score: { type: "score", bars: [] },
  configuration: {
    bpm: 100,
    graceTime: 50,
    signature: 16,
  },
} satisfies InitialState;

describe("store", () => {
  describe("addStave", () => {
    test("adds new staves based on the configured signature", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();

      const newStave = createStave(16);
      expect(store.getState().score).toEqual([newStave]);

      store.getState().onChangeConfiguration({ bpm: 100, graceTime: 50, signature: 4 });
      const updatedStave = createStave(4);
      expect(store.getState().score).toEqual([updatedStave]);
    });
  });

  describe("toggleNote", () => {
    test("Adds note to the score", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.notes.push({ type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "SNARE" },
      });
      stave[0]?.notes.at(0)?.keys.push({ type: "key", note: "SNARE" });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveIndex: 0,
        staveNoteIndex: 1,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });
      stave[1]?.notes.push({ type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] });
      expect(store.getState().score).toEqual([stave]);
    });

    test("Removes a note in case the same is already selected", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.notes.push({ type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });
      const newStave = createStave(16);
      newStave[0]!.notes.push({ type: "note", keys: [] });
      expect(store.getState().score).toEqual([newStave]);
    });

    test("Replaces note when note with modifier is toggled", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.notes.push({ type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" },
      });
      const staveWithModifier = createStave(16);
      staveWithModifier[0]!.notes.push({
        type: "note",
        keys: [{ type: "key", note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" }],
      });
      expect(store.getState().score).toEqual([staveWithModifier]);
    });
  });

  describe("removeStave", () => {
    test("Removes existing stave", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        partIndex: 0,
        note: { note: "HIGH_HAT" },
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 1,
        partIndex: 0,
        note: { note: "SNARE" },
      });

      const firstStave = createStave(16);
      firstStave[0]!.notes.push({ type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] });
      const secondStave = createStave(16);
      secondStave[0]!.notes.push({ type: "note", keys: [{ type: "key", note: "SNARE" }] });
      expect(store.getState().score).toEqual([firstStave, secondStave]);

      store.getState().removeStave(0);
      expect(store.getState().score).toEqual([secondStave]);
    });
  });
});

function createStorage(): StateStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (key) => {
      return storage.get(key) ?? "";
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    setItem: (key, value) => {
      storage.set(key, JSON.stringify(value));
    },
  };
}

function createStave(len: number) {
  let tempo: Tempo | undefined;
  switch (len) {
    case 4:
      tempo = "quarter";
      break;
    case 8:
      tempo = "eights";
      break;
    case 3:
      tempo = "triplet";
      break;
    case 16:
      tempo = "sixteens";
      break;
  }
  if (!tempo) {
    throw new Error("Could not translate value into tempo");
  }

  const parts: Part[] = [];
  for (let i = 0; i < len; i++) {
    parts.push({ type: "part", notes: [], tempo });
  }
  return parts;
}
