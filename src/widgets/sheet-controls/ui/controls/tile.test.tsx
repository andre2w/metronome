import { describe, expect, test, vi } from "vitest";
import { Tile } from "./tile";
import { render } from "~/shared/test/render";

describe("Tile", () => {
  test("displays content inside Tile", async () => {
    const component = await render(<Tile>ABCDE</Tile>);

    const element = component.locator.getByText("ABCDE");
    await expect.element(element).toBeVisible();
  });

  test("triggers action when clicking on tile", async () => {
    const onClick = vi.fn();
    const component = await render(<Tile onClick={onClick}>ABCDE</Tile>);

    const element = component.locator.getByText("ABCDE");
    await element.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
