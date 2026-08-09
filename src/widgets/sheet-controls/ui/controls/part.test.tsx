import { describe, expect, test } from "vitest";
import { render } from "~/shared/test/render";
import { Part } from "./part";
import { Part as ScorePart } from "~/shared/lib/score/score";
import { userEvent } from "vitest/browser";

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

const eightPart: ScorePart = {
  type: "part",
  tempo: "eights",
  notes: [
    { type: "note", keys: [] },
    { type: "note", keys: [] },
  ],
};

const quarterPart: ScorePart = {
  type: "part",
  tempo: "quarter",
  notes: [{ type: "note", keys: [] }],
};

describe("Part", () => {
  test.each([
    { part: sixteenPart, text: "1/16", tileCount: 41 },
    { part: eightPart, text: "1/8", tileCount: 21 },
    { part: quarterPart, text: "1/4", tileCount: 11 },
  ])("Renders part with tempo and counting: $part.tempo", async ({ part, text, tileCount }) => {
    const component = await render(<Part barIndex={0} partIndex={0} part={part} />);

    const tempo = component.getByText(text);
    await expect.element(tempo).toBeVisible();

    const tiles = component.getByRole("button").all();
    expect(tiles).toHaveLength(tileCount);
  });

  test("allow to change tempo by clicking on it", async () => {
    const component = await render(<Part barIndex={0} partIndex={0} part={quarterPart} />, {
      initalScore: {
        author: "",
        name: "",
        bpm: 60,
        type: "score",
        bars: [
          {
            type: "bar",
            parts: [{ type: "part", tempo: "quarter", notes: [{ type: "note", keys: [] }] }],
          },
        ],
      },
    });

    const tempo = component.getByRole("button", { name: "quarter" });
    await expect.element(tempo).toBeVisible();

    await userEvent.click(tempo);

    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.tempo).toEqual("eights");
  });
});
