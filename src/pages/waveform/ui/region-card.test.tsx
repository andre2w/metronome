import { describe, expect, test } from "vitest";
import { RegionCard } from "./region-card";
import { Region } from "wavesurfer.js/dist/plugins/regions";

import { render } from "~/shared/testing/render";
import { TestableRegion } from "~/shared/testing/testable-region";
describe("RegionCard", () => {
  test.each([
    { start: 10, end: 64, index: 0, text: "00:10 - 01:04Region 1" },
    { start: 60, end: 133, index: 3, text: "01:00 - 02:13Region 4" },
  ])(
    "Display region start and end times formatted as mm:SS: $start - $end",
    ({ start, end, index, text }) => {
      const region = new TestableRegion({ id: "region-1", start, end }) as unknown as Region;
      const component = render(<RegionCard index={index} region={region}></RegionCard>);

      expect(component.baseElement).toHaveTextContent(text);
    },
  );

  test("Allows user to add an annotation to the region", async () => {
    const region = new TestableRegion({ id: "region-1", start: 10, end: 20 }) as unknown as Region;
    const component = render(<RegionCard index={0} region={region}></RegionCard>);
    const user = component.user;

    const editButton = component.getByRole("button", { name: "Add annotation" });
    await user.click(editButton);

    const annotationField = component.getByRole("textbox");

    await user.type(annotationField, "First part");
    const saveButton = component.getByRole("button", { name: "save" });
    await user.click(saveButton);

    expect(region.getContent()).toMatch(/First part/);
    expect(annotationField).not.toBeVisible();
    expect(saveButton).not.toBeVisible();
  });

  test("Cancel current annotation", async () => {
    const region = new TestableRegion({ id: "region-1", start: 10, end: 20 }) as unknown as Region;
    const component = render(<RegionCard index={0} region={region}></RegionCard>);
    const user = component.user;

    const editButton = component.getByRole("button", { name: "Add annotation" });
    await user.click(editButton);

    const annotationField = component.getByRole("textbox");

    await user.type(annotationField, "First part");
    const cancelButton = component.getByRole("button", { name: "cancel" });
    await user.click(cancelButton);

    expect(region.getContent()).toBeUndefined();
    expect(annotationField).not.toBeVisible();
    expect(cancelButton).not.toBeVisible();
  });

  test("Allows user to edit existing annotation", async () => {
    const region = new TestableRegion({
      id: "region-1",
      start: 10,
      end: 20,
      content: "Region 1",
    }) as unknown as Region;
    const component = render(<RegionCard index={0} region={region}></RegionCard>);
    const user = component.user;

    const editButton = component.getByRole("button", { name: "Add annotation" });
    await user.click(editButton);

    const annotationField = component.getByRole("textbox");
    expect(annotationField).toHaveDisplayValue("Region 1");

    await user.type(annotationField, "Intro");
    const saveButton = component.getByRole("button", { name: "save" });
    await user.click(saveButton);

    expect(region.getContent()).toMatch(/Intro/);
  });

  test("Display current annotation next to time", async () => {
    const region = new TestableRegion({
      id: "region-1",
      start: 10,
      end: 64,
      content: "Intro",
    }) as unknown as Region;
    const component = render(<RegionCard index={0} region={region}></RegionCard>);

    expect(component.baseElement).toHaveTextContent("00:10 - 01:04Intro");
  });
});
