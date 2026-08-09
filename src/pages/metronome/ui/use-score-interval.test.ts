import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { renderHook } from "~/shared/test/render";
import { useScoreInterval } from "./use-score-interval";
import { act } from "@testing-library/react";

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
    });

    expect(hook.result.current.isToggled).toBeFalsy();

    act(() => {
      hook.result.current.toggle();
    });

    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(260);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(100);
    expect(hook.result.current.isToggled).toBeTruthy();
    expect(onTick).toHaveBeenCalledTimes(2);

    act(() => {
      hook.result.current.toggle();
    });
    expect(hook.result.current.isToggled).toBeFalsy();

    await vi.advanceTimersByTimeAsync(1_000);
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
