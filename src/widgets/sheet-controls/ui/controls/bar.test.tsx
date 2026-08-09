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
    const onRemoveStave = vi.fn();
    const component = await render(
      <Bar bar={bar} barIndex={0} onRemoveStave={onRemoveStave}></Bar>,
    );

    const barIndex = component.getByText("1").first();
    await expect.element(barIndex).toHaveTextContent("1");
    await expect.element(barIndex).toBeVisible();
  });

  test("Render bars with index and parts", async () => {
    const onRemoveStave = vi.fn();
    const component = await render(
      <Bar bar={bar} barIndex={0} onRemoveStave={onRemoveStave}></Bar>,
    );

    const removeBar = component.getByRole("button", { name: "Remove bar" });
    await removeBar.click();

    expect(onRemoveStave).toHaveBeenCalledTimes(1);
  });
});
