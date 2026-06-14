import { RegionEvents, RegionParams, UpdateSide } from "wavesurfer.js/dist/plugins/regions.js";

/**
 * This is a testable version of the Region class, it does not
 * extends or implements the Region because the same is only exported as a type
 * and it can't be extended and using the `implements` keyword is not enough
 */
export class TestableRegion {
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
  _onUpdate(_1: number, _2?: UpdateSide, _3?: number): void {
    throw new Error("Method not implemented.");
  }
  onContentBlur(): void {
    throw new Error("Method not implemented.");
  }
  _setTotalDuration(_4: number): void {
    throw new Error("Method not implemented.");
  }
  play(_5?: boolean): void {
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
    _6: Partial<
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
    _7: EventName,
    _8: (...args: RegionEvents[EventName]) => void,
    _9?: { once?: boolean },
  ): () => void {
    throw new Error("Method not implemented.");
  }
  un<EventName extends keyof RegionEvents>(
    _10: EventName,
    _11: (...args: RegionEvents[EventName]) => void,
  ): void {
    throw new Error("Method not implemented.");
  }
  once<EventName extends keyof RegionEvents>(
    _12: EventName,
    _13: (...args: RegionEvents[EventName]) => void,
  ): () => void {
    throw new Error("Method not implemented.");
  }
  unAll(): void {
    throw new Error("Method not implemented.");
  }
  protected emit<EventName extends keyof RegionEvents>(
    _14: EventName,
    ..._15: RegionEvents[EventName]
  ): void {
    throw new Error("Method not implemented.");
  }
}
