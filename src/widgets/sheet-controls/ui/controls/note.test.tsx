import { describe, expect, test } from "vitest";
import { render } from "~/shared/test/render";
import { Note } from "./note";
import { page } from "vitest/browser";

describe("Note", () => {
  test("renders all keys for the note with count on top", async () => {
    const component = await render(
      <Note
        index={{ barIndex: 0, noteIndex: 0, partIndex: 0 }}

        noteCount="1"
      />,
    );

    const tileLocator = component.locator.getByRole("button").all();
    expect(tileLocator).toHaveLength(10);
    const stickingsTile = tileLocator.at(0)?.element();
    await expect.element(stickingsTile!).toHaveTextContent("1");
  });

  test("allows to loop between stickings when clicking on the count", async () => {
    const component = await render(
      <Note
        index={{ barIndex: 0, noteIndex: 0, partIndex: 0 }}

        noteCount="1"
      />,
    );

    let stickingTile = component.locator.getByRole("button").first();
    await expect.element(stickingTile).toHaveTextContent("1");
    await stickingTile.click();

    stickingTile = component.locator.getByRole("button").first();
    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)?.sticking).toEqual(
      "L",
    );
    await expect.element(stickingTile).toHaveTextContent("L");

    stickingTile = component.locator.getByRole("button").first();
    await stickingTile.click();
    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)?.sticking).toEqual(
      "R",
    );
    await expect.element(stickingTile).toHaveTextContent("R");

    stickingTile = component.locator.getByRole("button").first();
    await stickingTile.click();
    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)?.sticking).toEqual(
      "R/L",
    );
    await expect.element(stickingTile).toHaveTextContent("R/L");

    stickingTile = component.locator.getByRole("button").first();
    await stickingTile.click();
    expect(
      component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)?.sticking,
    ).toBeUndefined();
    await expect.element(stickingTile).toHaveTextContent("1");
  });

  test("add part to score when clicking on it", async () => {
    const component = await render(
      <Note
        index={{ barIndex: 0, noteIndex: 0, partIndex: 0 }}

        noteCount="1"
      />,
    );

    const snareButton = component.locator.getByRole("button", { name: "SNARE" });
    await snareButton.click();

    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)).toEqual({
      type: "note",
      keys: [{ type: "key", note: "SNARE" }],
    });
  });

  test("display modifiers when right clicking the note", async () => {
    const component = await render(
      <Note
        index={{ barIndex: 0, noteIndex: 0, partIndex: 0 }}

        noteCount="1"
      />,
    );

    const snareButton = component.locator.getByRole("button", { name: "SNARE" });
    await snareButton.click({ button: "right" });

    const ghostedSnare = page.getByText("Ghosted");
    await expect.element(ghostedSnare).toBeVisible();
    await ghostedSnare.click();
    expect(component.store.getState().score.bars.at(0)?.parts.at(0)?.notes.at(0)).toEqual({
      type: "note",
      keys: [{ type: "key", note: "SNARE", modifier: "GHOST_SNARE" }],
    });
  });
});
