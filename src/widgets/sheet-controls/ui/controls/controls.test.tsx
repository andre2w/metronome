import { describe, expect, test } from "vitest";
import { render } from "~/shared/test/render";
import { Controls } from "./controls";

describe("Controls", () => {
  test("Allows to add new bars to the score", async () => {
    const component = await render(<Controls />);
    expect(component.store.getState().score.bars).toHaveLength(1);
    const addPart = component.getByRole("button", { name: "Add stave" });
    await addPart.click();

    expect(component.store.getState().score.bars).toHaveLength(2);
  });

  test("Allows to clear existing score", async () => {
    const component = await render(<Controls />);

    const snareButton = component.getByRole("button", { name: "SNARE" }).first();
    await snareButton.click();

    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)).toEqual({
      type: "note",
      keys: [{ type: "key", note: "SNARE" }],
    });

    await component.getByRole("button", { name: "New score" }).click();
    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)).toEqual({
      type: "note",
      keys: [],
    });
  });
});
