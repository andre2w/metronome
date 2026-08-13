import { describe, expect, test, vi } from "vitest";
import { render } from "~/shared/test/render";
import { Bar } from "./bar";
import { Bar as ScoreBar, Part as ScorePart } from "~/shared/lib/score/score";

const sixteenPart: ScorePart = {
  type: "part",
  tempo: "sixteens",
  notes: [
    { type: "note", keys: [] },
    { type: "note", keys: [] },
    { type: "note", keys: [] },
    { type: "note", keys: [] },
  ],
};

const bar: ScoreBar = {
  type: "bar",
  parts: [sixteenPart],
};

describe("Bar", () => {
  test("Render bars with index and parts", async () => {
    const component = await render(<Bar bar={bar} barIndex={0}></Bar>);

    const barIndex = component.getByText("1").first();
    await expect.element(barIndex).toHaveTextContent("1");
    await expect.element(barIndex).toBeVisible();
  });

  test("Allows to remove existing bars", async () => {
    const component = await render(<Bar bar={bar} barIndex={0}></Bar>, {
      initalScore: {
        author: "",
        bars: [
          {
            type: "bar",
            parts: [{ ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }],
          },
          {
            type: "bar",
            parts: [{ ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }],
          },
        ],
        bpm: 100,
        name: "",
        type: "score",
      },
    });

    const removeBar = component.getByRole("button", { name: "Remove bar" });
    await removeBar.click();

    expect(component.store.getState().score.bars).toEqual([
      {
        type: "bar",
        parts: [{ ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }, { ...sixteenPart }],
      },
    ]);
  });

  test("hover a bar selects them for highlighting", async () => {
    const onHoverBar = vi.fn();
    const component = await render(<Bar bar={bar} barIndex={0} onHoverBar={onHoverBar}></Bar>);

    const removeBar = component.getByRole("button", { name: "Remove bar" });
    await component.userEvent.hover(removeBar);
    expect(onHoverBar).toHaveBeenCalledTimes(1);
    expect(onHoverBar).toHaveBeenCalledWith({ bar: 0 });

    await component.userEvent.unhover(removeBar);
    expect(onHoverBar).toHaveBeenCalledTimes(2);
    expect(onHoverBar).toHaveBeenCalledWith(null);
  });
});
