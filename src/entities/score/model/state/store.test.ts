import { describe, expect, test } from "vitest";
import { createScoreStore } from "./store";
import { NotesWithSticking } from "../types";
import { StateStorage } from "zustand/middleware";

const initialState = {
  score: [],
  configuration: {
    bpm: 100,
    graceTime: 50,
    signature: 16,
  },
};

describe("store", () => {
  describe("addStave", () => {
    test("adds new staves based on the configured signature", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().addStave();

      const newStave = Array.from<NotesWithSticking>({ length: 16 }).fill({
        keys: [],
      });
      expect(store.getState().score).toEqual([newStave]);

      store.getState().onChangeConfiguration({ bpm: 100, graceTime: 50, signature: 4 });
      const updatedStave = Array.from<NotesWithSticking>({ length: 4 }).fill({
        keys: [],
      });
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
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.keys.push({ note: "HIGH_HAT" });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        note: { note: "SNARE" },
      });
      stave[0]!.keys.push({ note: "SNARE" });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 1,
        staveIndex: 0,
        note: { note: "HIGH_HAT" },
      });
      stave[1]!.keys.push({ note: "HIGH_HAT" });
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
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.keys.push({ note: "HIGH_HAT" });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        note: { note: "HIGH_HAT" },
      });
      expect(store.getState().score).toEqual([createStave(16)]);
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
        note: { note: "HIGH_HAT" },
      });

      const stave = createStave(16);
      stave[0]!.keys.push({ note: "HIGH_HAT" });
      expect(store.getState().score).toEqual([stave]);

      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 0,
        note: { note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" },
      });
      const staveWithModifier = createStave(16);
      staveWithModifier[0]!.keys.push({ note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" });
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
        note: { note: "HIGH_HAT" },
      });

      store.getState().addStave();
      store.getState().toggleNote({
        staveNoteIndex: 0,
        staveIndex: 1,
        note: { note: "SNARE" },
      });

      const firstStave = createStave(16);
      firstStave[0]!.keys.push({ note: "HIGH_HAT" });
      const secondStave = createStave(16);
      secondStave[0]!.keys.push({ note: "SNARE" });
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
  const newArr: NotesWithSticking[] = [];
  for (let i = 0; i < len; i++) {
    newArr.push({ keys: [] });
  }

  return newArr;
}
