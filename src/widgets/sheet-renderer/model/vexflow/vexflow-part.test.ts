import { describe, test } from "vitest";
import { VexflowPart } from "./vexflow-part";

describe("VexflowPart", () => {
  test("parses part when creating ", () => {
    const part = new VexflowPart({
      type: "part",
      tempo: "sixteens",
      notes: [
        { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        { type: "note", keys: [] },
        { type: "note", keys: [] },
        { type: "note", keys: [{ type: "key", note: "SNARE" }] },
      ],
    });

    console.log(part);
  });
});
