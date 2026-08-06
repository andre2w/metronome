import { describe, expect, it, vi } from "vitest";
import { createStore } from "zustand/vanilla";
import { ScoreContextValue } from "~/entities/score/model/state/score-state";
import { createMetronomeSlice } from "./store";
import { MetronomeValues } from "~/shared/lib/metronome";

describe("store", () => {
  describe("toggle", () => {
    it("toggles metronome allowing to start counting", () => {
      const store = createTestStore();

      expect(store.getState()).toMatchObject({
        metronome: {
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });
      store.getState().toggle();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });

      store.getState().toggle();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });
    });

    it("resets the cursor when the metronome is stopped", () => {
      const store = createTestStore();

      store.getState().toggle();
      store.getState().next();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 1,
          cursor: { bar: 0, part: 0, note: 1 },
        },
      });
      store.getState().toggle();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });
    });
  });

  describe("next", () => {
    it("moves cursor forward keeping track the total number of ticks", () => {
      const store = createTestStore();

      expect(store.getState()).toMatchObject({
        metronome: {
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });
      store.getState().toggle();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
        },
      });
      store.getState().next();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 1,
          cursor: { bar: 0, part: 0, note: 1 },
        },
      });
      store.getState().next();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 2,
          cursor: { bar: 0, part: 0, note: 2 },
        },
      });

      store.getState().next();
      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 3,
          cursor: { bar: 0, part: 0, note: 3 },
        },
      });
    });

    it("moves cursor forward to the next part when note is over", () => {
      const store = createTestStore();
      store.getState().toggle();

      for (let i = 0; i < 4; i++) {
        store.getState().next();
      }

      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 4,
          cursor: {
            bar: 0,
            part: 1,
            note: 0,
          },
        },
      });
    });

    it("moves curser forward to the next bar when part is over", () => {
      const store = createTestStore();
      store.getState().toggle();

      for (let i = 0; i < 12; i++) {
        store.getState().next();
      }

      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 12,
          cursor: {
            bar: 1,
            part: 0,
            note: 0,
          },
        },
      });
    });

    it("loops back to the start when the cursor reaches the end of the score", () => {
      const store = createTestStore();
      store.getState().toggle();

      for (let i = 0; i < 28; i++) {
        store.getState().next();
      }

      expect(store.getState()).toMatchObject({
        metronome: {
          started: true,
          ticks: 28,
          cursor: {
            bar: 0,
            part: 0,
            note: 0,
          },
        },
      });
    });
  });

  describe("setMetronomeConfig", () => {
    it.each<Partial<MetronomeValues["metronome"]>>([{ bpm: 150 }, { graceTime: 20 }])(
      "updates the metronome configuration",
      (updateValue) => {
        const store = createTestStore();

        expect(store.getState().metronome).toEqual({
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
          bpm: 60,
          graceTime: 100,
        });

        store.getState().setMetronomeConfig(updateValue);

        expect(store.getState().metronome).toEqual({
          started: false,
          ticks: 0,
          cursor: { bar: 0, part: 0, note: 0 },
          bpm: 60,
          graceTime: 100,
          ...updateValue,
        });
      },
    );
  });

  it("does not allow graceTime to be set to a value greater than the time between two ticks", () => {
    const store = createTestStore();

    store.getState().setMetronomeConfig({ graceTime: 1500 });

    expect(store.getState().metronome).toEqual({
      started: false,
      ticks: 0,
      cursor: { bar: 0, part: 0, note: 0 },
      bpm: 60,
      graceTime: 1000,
    });
  });

  it("does not allow graceTime to be greater than ceiling for a bpm when bpm is updated", () => {
    const store = createTestStore();

    store.getState().setMetronomeConfig({ bpm: 1000 });
    expect(store.getState().metronome).toEqual({
      started: false,
      ticks: 0,
      cursor: { bar: 0, part: 0, note: 0 },
      bpm: 1000,
      graceTime: 60,
    });
  });
});

function createTestStore() {
  return createStore<MetronomeValues & ScoreContextValue>()((...args) => ({
    ...createMetronomeSlice(...args),
    updateMetadata: vi.fn(),
    addBar: vi.fn(),
    clear: vi.fn(),
    configuration: {
      bpm: 100,
      graceTime: 100,
      signature: 4,
    },
    toggleNote: vi.fn(),
    setSticking: vi.fn(),
    onChangeConfiguration: vi.fn(),
    loadScore: vi.fn(),
    removeBar: vi.fn(),

    score: {
      author: "",
      bpm: 100,
      name: "",
      type: "score",
      bars: [
        {
          type: "bar",
          parts: [
            {
              type: "part",
              tempo: "quarter",
              notes: [
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
              ],
            },
            {
              type: "part",
              tempo: "eights",
              notes: [
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
              ],
            },
          ],
        },
        {
          type: "bar",
          parts: [
            {
              type: "part",
              tempo: "sixteens",
              notes: [
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
                { type: "note", keys: [] },
              ],
            },
          ],
        },
      ],
    },
  }));
}
