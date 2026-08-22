import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { renderHook } from "~/shared/test/render";
import { useScoreInterval } from "./use-score-interval";
import { Bar, Part } from "~/shared/lib/score/score";
import { act } from "react";

const quarterPart: Part = {
  type: "part",
  tempo: "quarter",
  notes: [{ type: "note", keys: [{ type: "key", note: "SNARE" }] }],
};
const eigthsPart: Part = {
  type: "part",
  tempo: "eights",
  notes: [
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
  ],
};
const sixteensPart: Part = {
  type: "part",
  tempo: "sixteens",
  notes: [
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
    { type: "note", keys: [{ type: "key", note: "SNARE" }] },
  ],
};

const bar: Bar = {
  type: "bar",
  parts: [quarterPart, eigthsPart, sixteensPart],
};

describe("useScoreInterval", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("Advances time based on tempo", async () => {
    const onTick = vi.fn();
    const hook = await renderHook(useScoreInterval, {
      initialProps: { onTick },
      initialScore: {
        author: "",
        bars: [bar],
        bpm: 60,
        name: "",
        type: "score",
      },
    });
    expect(hook.result.current.isToggled).toBeFalsy();

    act(() => {
      hook.result.current.toggle();
    });

    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(100);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(500);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(500);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(4);

    await vi.advanceTimersByTimeAsync(90);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(4);

    await vi.advanceTimersByTimeAsync(60);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(5);

    await vi.advanceTimersByTimeAsync(250);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(6);

    await vi.advanceTimersByTimeAsync(250);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(7);

    await vi.advanceTimersByTimeAsync(250);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(8);
  });

  test("Advances time taking into account triplets", async () => {
    const onTick = vi.fn();
    const eightTriplet: Part = {
      type: "part",
      tempo: "eight_triplet",
      notes: [
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
      ],
    };
    const sixteenTriplet: Part = {
      type: "part",
      tempo: "sixteen_triplet",
      notes: [
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
      ],
    };
    const tripletBar: Bar = {
      type: "bar",
      parts: [eightTriplet, sixteenTriplet],
    };
    const hook = await renderHook(useScoreInterval, {
      initialProps: { onTick },
      initialScore: {
        author: "",
        bars: [tripletBar],
        bpm: 60,
        name: "",
        type: "score",
      },
    });

    expect(hook.result.current.isToggled).toBeFalsy();

    act(() => {
      hook.result.current.toggle();
    });

    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(onTick).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(250);
    expect(onTick).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(350);
    expect(onTick).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(350);
    expect(onTick).toHaveBeenCalledTimes(4);

    await vi.advanceTimersByTimeAsync(125);
    expect(onTick).toHaveBeenCalledTimes(5);

    await vi.advanceTimersByTimeAsync(167);
    expect(onTick).toHaveBeenCalledTimes(6);
  });
});
