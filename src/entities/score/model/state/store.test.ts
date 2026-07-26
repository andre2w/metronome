import { describe, expect, test } from "vitest";
import { createScoreStore } from "./store";
import { Bar, Note, Part, Score, type Tempo } from "../types";
import { StateStorage } from "zustand/middleware";
import { InitialState } from "./initial-state";

const initialState = {
  score: {
    type: "score",
    bars: [createBar(16)],
  },
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

      const existingBar = createBar(16);
      expect(store.getState().score).toEqual<Score>({ type: "score", bars: [existingBar] });

      store.getState().onChangeConfiguration({ bpm: 100, graceTime: 50, signature: 4 });
      const updatedBar = createBar(4);
      expect(store.getState().score).toEqual({ type: "score", bars: [updatedBar] });
    });
  });

  describe("toggleNote", () => {
    test("Adds note to the score", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const bar = createBar(16);
      bar.parts[0]!.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({ type: "score", bars: [bar] });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "SNARE" },
      });
      bar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "SNARE" });
      expect(store.getState().score).toEqual({ type: "score", bars: [bar] });

      store.getState().toggleNote({
        barIndex: 0,
        partIndex: 1,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      bar.parts[1]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual({ type: "score", bars: [bar] });
    });

    test("Removes a note in case the same is already selected", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const stave = createBar(16);
      stave.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({ type: "score", bars: [stave] });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      const newStave = createBar(16);
      stave.parts[0]?.notes.push({ type: "note", keys: [] });
      expect(store.getState().score).toEqual<Score>({ type: "score", bars: [newStave] });
    });

    test("Replaces note when note with modifier is toggled", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const bar = createBar(16);
      bar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual({ type: "score", bars: [bar] });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" },
      });
      const barWithModifier = createBar(16);
      barWithModifier.parts[0]?.notes[0]?.keys.push({
        type: "key",
        note: "HIGH_HAT",
        modifier: "HIGH_HAT_OPEN",
      });
      expect(store.getState().score).toEqual({ type: "score", bars: [barWithModifier] });
    });
  });

  describe("removeStave", () => {
    test("Removes existing stave", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      const firstBar = createBar(16);
      firstBar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        type: "score",
        bars: [firstBar],
      });

      store.getState().addStave();
      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 1,
        noteIndex: 0,
        key: { note: "SNARE" },
      });

      const secondBar = createBar(16);
      secondBar.parts[0]!.notes[0]?.keys.push({ type: "key", note: "SNARE" });
      expect(store.getState().score).toEqual<Score>({
        type: "score",
        bars: [firstBar, secondBar],
      });

      store.getState().removeStave(0);
      expect(store.getState().score).toEqual({
        type: "score",
        bars: [secondBar],
      });
    });
  });

  describe("clear", () => {
    test("clears existing score", () => {
      const store = createScoreStore({
        initialState,
        storage: createStorage(),
      });

      store
        .getState()
        .toggleNote({ barIndex: 0, key: { note: "HIGH_HAT" }, noteIndex: 0, partIndex: 0 });
      const bar = createBar(16);
      bar.parts[0]!.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        type: "score",
        bars: [bar],
      });

      store.getState().clear();

      const emptyBar = createBar(16);
      expect(store.getState().score).toEqual<Score>({
        type: "score",
        bars: [emptyBar],
      });
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

function createBar(len: number): Bar {
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

  let notesPerPart: number;
  switch (len) {
    case 4:
      notesPerPart = 1;
      break;
    case 8:
      notesPerPart = 2;
      break;
    case 3:
      notesPerPart = 3;
      break;
    case 16:
      notesPerPart = 4;
      break;
    default:
      throw new Error("Invalid number of notes per part");
  }

  const parts: Part[] = [];
  for (let i = 0; i < len; i++) {
    const notes: Note[] = [];
    for (let i = 0; i < notesPerPart; i++) {
      notes.push({ type: "note", keys: [], sticking: undefined });
    }
    parts.push({ type: "part", notes: notes, tempo });
  }
  return { type: "bar", parts: parts };
}
