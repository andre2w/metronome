import { describe, expect, test } from "vitest";
import { VexflowPart } from "./vexflow-part";
import { ReducedStaveNote } from "./vexflow-wrapper";
import { Configuration } from "~/shared/lib/configuration/configuration-provider";
import { KEYS } from "~/entities/score/model/notes";

const configuration = new Configuration(KEYS, {});
describe("VexflowPart", () => {
  test("parses part with all notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
    ]);
  });

  test("parses part with rest increasing the duration of the previous notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [{ type: "key", note: "SNARE" }] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "eights",
        withDot: true,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
      {
        type: "note",
        duration: "sixteens",
        keys: [{ note: "SNARE" }],
        withDot: false,
      },
    ]);
  });

  test("parses part with rest increasing the duration of the previous notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "eights",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "noop",
      },
      {
        type: "note",
        duration: "eights",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "noop",
      },
    ]);
  });

  test("parses part with rest increasing the duration of the previous notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "quarter",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
    ]);
  });

  test("parses part with rest increasing the duration of the previous notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "eights",
        withDot: true,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
    ]);
  });

  test("parses part with rest of first three notes", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [{ note: "SNARE", type: "key" }] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "eights",
        withDot: false,
        keys: [],
      },
      {
        type: "noop",
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "SNARE" }],
      },
    ]);
  });

  test("parses part with full rest", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
          { type: "note", keys: [] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "quarter",
        withDot: false,
        keys: [],
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
      {
        type: "noop",
      },
    ]);
  });

  test("parses part without rest", () => {
    const part = new VexflowPart(
      {
        type: "part",
        tempo: "sixteens",
        notes: [
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
          { type: "note", keys: [{ type: "key", note: "HIGH_HAT" }] },
        ],
      },
      configuration,
      "black",
    );

    expect(part.reducedNotes).toEqual<ReducedStaveNote[]>([
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
      {
        type: "note",
        duration: "sixteens",
        withDot: false,
        keys: [{ note: "HIGH_HAT" }],
      },
    ]);
  });
});
