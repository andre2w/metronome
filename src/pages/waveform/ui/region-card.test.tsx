import { describe, expect, test } from "vitest";
import { RegionCard } from "./region-card";
import { Region, UpdateSide, RegionEvents, RegionParams } from "wavesurfer.js/dist/plugins/regions";
import { render } from "~/shared/testing/render";

/**
 * This is a testable version of the Region class, it does not
 * extends or implements the Region because the same is only exported as a type
 * and it can't be extended and using the `implements` keyword is not enough
 */
class TestableRegion {
  isRemoved: boolean;
  id: string;
  resize: boolean;
  resizeStart: boolean;
  resizeEnd: boolean;
  color: string;
  content?: HTMLElement | undefined;
  minLength: number;
  maxLength: number;
  channelIdx: number;
  contentEditable: boolean;
  subscriptions: (() => void)[];
  updatingSide?: UpdateSide | undefined;
  element: HTMLElement | null;
  start: number;
  end: number;
  drag: boolean;

  constructor({
    id,
    start,
    end,
    content,
  }: {
    id: string;
    start: number;
    end: number;
    content?: string;
  }) {
    this.isRemoved = false;
    this.id = id;
    this.resize = false;
    this.resizeEnd = false;
    this.resizeStart = false;
    this.color = "";
    this.minLength = 0;
    this.maxLength = Number.POSITIVE_INFINITY;
    this.channelIdx = 1;
    this.contentEditable = true;
    this.subscriptions = [];
    this.updatingSide = undefined;
    this.element = null;
    this.start = start;
    this.end = end;
    this.drag = true;
    if (content) {
      this.setContent(content);
    }
  }
  _onUpdate(dx: number, side?: UpdateSide, startTime?: number): void {
    throw new Error("Method not implemented.");
  }
  onContentBlur(): void {
    throw new Error("Method not implemented.");
  }
  _setTotalDuration(totalDuration: number): void {
    throw new Error("Method not implemented.");
  }
  play(stopAtEnd?: boolean): void {
    throw new Error("Method not implemented.");
  }
  getContent(asHTML?: boolean): string | HTMLElement | undefined {
    if (asHTML) {
      return this.content;
    }

    return this.content?.innerText;
  }
  setContent(content: RegionParams["content"]): void {
    if (typeof content === "string") {
      const span = document.createElement("span");
      span.innerText = content;
      this.content = span;
    } else {
      this.content = content;
    }
  }
  setOptions(
    options: Partial<
      Pick<
        RegionParams,
        | "color"
        | "start"
        | "end"
        | "drag"
        | "content"
        | "id"
        | "resize"
        | "resizeStart"
        | "resizeEnd"
      >
    >,
  ): void {
    throw new Error("Method not implemented.");
  }
  remove(): void {
    throw new Error("Method not implemented.");
  }
  on<EventName extends keyof RegionEvents>(
    event: EventName,
    listener: (...args: RegionEvents[EventName]) => void,
    options?: { once?: boolean },
  ): () => void {
    throw new Error("Method not implemented.");
  }
  un<EventName extends keyof RegionEvents>(
    event: EventName,
    listener: (...args: RegionEvents[EventName]) => void,
  ): void {
    throw new Error("Method not implemented.");
  }
  once<EventName extends keyof RegionEvents>(
    event: EventName,
    listener: (...args: RegionEvents[EventName]) => void,
  ): () => void {
    throw new Error("Method not implemented.");
  }
  unAll(): void {
    throw new Error("Method not implemented.");
  }
  protected emit<EventName extends keyof RegionEvents>(
    eventName: EventName,
    ...args: RegionEvents[EventName]
  ): void {
    throw new Error("Method not implemented.");
  }
}

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
