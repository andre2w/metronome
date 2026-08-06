import { describe, expect, test } from "vitest";
import { VexflowPart } from "./vexflow-part";
import { ReducedStaveNote } from "./vexflow-wrapper";

describe("VexflowPart", () => {
  test("parses part with all notes", () => {
    const part = new VexflowPart({
      type: "part",
      tempo: "sixteens",
      notes: [
        { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
      ],
    });

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        notes: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        notes: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        notes: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        notes: [{ note: "HIGH_HAT" }],
      },
    ]);
  });

  test("parses part with rest increasing the duration of the previous notes", () => {
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

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "eights",
        withDot: true,
        notes: [{ note: "HIGH_HAT" }],
      },
      {
        type: "rest",
        duration: "sixteens",
      },
      {
        type: "rest",
        duration: "sixteens",
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        notes: [{ note: "SNARE" }],
      },
    ]);
  });
});
