import { describe, expect, test } from "vitest";
import { createScoreSlice } from "./store";
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { ScoreContextValue } from "./score-state";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { createMetronomeSlice } from "~/entities/metronome/model/store";
import { MetronomeValues } from "~/shared/lib/metronome";
import { Bar, Note, Part, Score, Tempo } from "~/shared/lib/score/score";
import { createTestStorage } from "~/shared/test/test-store";

describe("store", () => {
  describe("toggleNote", () => {
    test("Adds note to the score", () => {
      const store = createTestStore();

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const bar = createBar(16);
      bar.parts[0]!.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [bar],
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "SNARE" },
      });
      bar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "SNARE" });
      expect(store.getState().score).toEqual({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [bar],
      });

      store.getState().toggleNote({
        barIndex: 0,
        partIndex: 1,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      bar.parts[1]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [bar],
      });
    });

    test("Removes a note in case the same is already selected", () => {
      const store = createTestStore();

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const stave = createBar(16);
      stave.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [stave],
      });

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      const newStave = createBar(16);
      stave.parts[0]?.notes.push({ type: "note", keys: [] });
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [newStave],
      });
    });

    test("Replaces note when note with modifier is toggled", () => {
      const store = createTestStore();

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });

      const bar = createBar(16);
      bar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [bar],
      });

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
      expect(store.getState().score).toEqual({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [barWithModifier],
      });
    });
  });

  describe("removeStave", () => {
    test("Removes existing stave", () => {
      const store = createTestStore();

      store.getState().toggleNote({
        partIndex: 0,
        barIndex: 0,
        noteIndex: 0,
        key: { note: "HIGH_HAT" },
      });
      const firstBar = createBar(16);
      firstBar.parts[0]?.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [firstBar],
      });

      store.getState().addBar();
    });
  });

  describe("clear", () => {
    test("clears existing score", () => {
      const store = createTestStore();

      store
        .getState()
        .toggleNote({ barIndex: 0, key: { note: "HIGH_HAT" }, noteIndex: 0, partIndex: 0 });
      const bar = createBar(16);
      bar.parts[0]!.notes[0]?.keys.push({ type: "key", note: "HIGH_HAT" });
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [bar],
      });

      store.getState().clear();

      const emptyBar = createBar(16);
      expect(store.getState().score).toEqual<Score>({
        author: "",
        bpm: 100,
        name: "",
        type: "score",
        bars: [emptyBar],
      });
    });
  });

  describe("changeTempo", () => {
    test("changes tempo of an existing part", () => {
      const store = createTestStore();

      store.getState().changeTempo({ index: { barIndex: 0, partIndex: 0 }, tempo: "quarter" });

      expect(store.getState().score.bars.at(0)?.parts.at(0)).toEqual<Part>({
        type: "part",
        notes: [{ type: "note", keys: [] }],
        tempo: "quarter",
      });
    });
  });
});

function createTestStore() {
  const initialState: Score = {
    type: "score",
    bars: [createBar(16)],
    author: "",
    bpm: 100,
    name: "",
  };

  return createStore<ScoreContextValue & MetronomeValues>()(
    persist(
      immer((...args) => ({
        ...createScoreSlice(initialState)(...args),
        ...createMetronomeSlice(...args),
      })),
      {
        name: "score",
        storage: createJSONStorage(() => createTestStorage()),
      },
    ),
  );
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
  for (let i = 0; i < 4; i++) {
    const notes: Note[] = [];
    for (let i = 0; i < notesPerPart; i++) {
      notes.push({ type: "note", keys: [], sticking: undefined });
    }
    parts.push({ type: "part", notes: notes, tempo });
  }
  return { type: "bar", parts: parts };
}
