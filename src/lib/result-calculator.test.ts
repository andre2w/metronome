import test from "node:test";
import assert from "node:assert";
import type { NotePlayed, Score } from "./types";
import {
  calculateResult,
  type CalculateResultProps,
} from "./result-calculator";

test("calculate results for simple score with a single part being played", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 10, note: "SNARE" },
    { timestamp: 15, note: "SNARE" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 25, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 35, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 50, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 0, right: 8 },
  );
});

test("calculate results for simple scores with multiple parts being played", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 10, note: "SNARE" },
    { timestamp: 10, note: "HIGH_HAT" },
    { timestamp: 15, note: "SNARE" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 25, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 30, note: "HIGH_HAT" },
    { timestamp: 35, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 50, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 0, right: 8 },
  );
});

test("counts as a miss if there's a missing part in the tick", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 10, note: "SNARE" },
    { timestamp: 15, note: "SNARE" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 25, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 30, note: "HIGH_HAT" },
    { timestamp: 35, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 50, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 1, right: 7 },
  );
});

test("counts as a miss if more parts are played during a tick", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 10, note: "SNARE" },
    { timestamp: 10, note: "HIGH_HAT" },
    { timestamp: 10, note: "CRASH" },
    { timestamp: 15, note: "SNARE" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 25, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 30, note: "HIGH_HAT" },
    { timestamp: 35, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 50, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 1, right: 7 },
  );
});

test("group notes for a tick inside the grace time", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 9, note: "SNARE" },
    { timestamp: 12, note: "HIGH_HAT" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 49, note: "SNARE" },
    { timestamp: 51, note: "HIGH_HAT" },
    { timestamp: 60, note: "SNARE" },
    { timestamp: 70, note: "SNARE" },
    { timestamp: 80, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 2 }),
    { missed: 0, right: 8 },
  );
});

test("loops through the score when the number of ticks is greater than entire score", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 9, note: "SNARE" },
    { timestamp: 12, note: "HIGH_HAT" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 49, note: "SNARE" },
    { timestamp: 51, note: "HIGH_HAT" },
    { timestamp: 60, note: "SNARE" },
    { timestamp: 70, note: "SNARE" },
    { timestamp: 80, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 2 }),
    { missed: 0, right: 8 },
  );
});

test("only counts ticks and ignore rest of score if not played entirely", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 9, note: "SNARE" },
    { timestamp: 12, note: "HIGH_HAT" },
    { timestamp: 20, note: "SNARE" },
    { timestamp: 30, note: "SNARE" },
    { timestamp: 40, note: "SNARE" },
    { timestamp: 49, note: "SNARE" },
    { timestamp: 51, note: "HIGH_HAT" },
    { timestamp: 60, note: "SNARE" },
    { timestamp: 70, note: "SNARE" },
    { timestamp: 80, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE", "HIGH_HAT"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 2 }),
    { missed: 0, right: 8 },
  );
});

test("calculates results when user start to play later", () => {
  const ticks = [
    10, 15, 20, 25, 30, 35, 40, 50, 100, 101, 102, 103, 104, 105, 106, 107,
  ];
  const notesPlayed: NotePlayed[] = [
    { timestamp: 100, note: "SNARE" },
    { timestamp: 101, note: "SNARE" },
    { timestamp: 102, note: "SNARE" },
    { timestamp: 103, note: "SNARE" },
    { timestamp: 104, note: "SNARE" },
    { timestamp: 105, note: "SNARE" },
    { timestamp: 106, note: "SNARE" },
    { timestamp: 107, note: "SNARE" },
  ];
  const score: Score = [
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 8, right: 8 },
  );
});

test("when no notes were played", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [];
  const score: Score = [
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
    [
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
      { notes: ["SNARE"] },
    ],
  ];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 8, right: 0 },
  );
});

test("when there is no score", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [];
  const score: Score = [];

  assert.deepStrictEqual(
    calculateResult({ ticks, notesPlayed, score, graceTime: 0 }),
    { missed: 0, right: 0 },
  );
});

test("real world example", { only: true }, () => {
  const props: CalculateResultProps = {
    ticks: [
      31710.5, 32460, 33210.200000047684, 33959.80000001192, 34710.60000002384,
      35460.200000047684, 36210.80000001192, 36960.700000047684, 37709.5, 38460,
      39209.60000002384, 39959.90000003576, 40710.200000047684, 41459.5,
      42209.90000003576, 42959.700000047684, 43710.200000047684,
      44459.90000003576,
    ],
    notesPlayed: [
      {
        timestamp: 31941.600000023842,
        note: "SNARE",
      },
      {
        timestamp: 32581.600000023842,
        note: "SNARE",
      },
      {
        timestamp: 33231.60000002384,
        note: "SNARE",
      },
      {
        timestamp: 33921.5,
        note: "SNARE",
      },
      {
        timestamp: 34581.40000003576,
        note: "SNARE",
      },
      {
        timestamp: 35261.60000002384,
        note: "SNARE",
      },
      {
        timestamp: 36031.60000002384,
        note: "SNARE",
      },
      {
        timestamp: 36871.60000002384,
        note: "SNARE",
      },
      {
        timestamp: 37761.60000002384,
        note: "SNARE",
      },
      {
        timestamp: 38601.5,
        note: "SNARE",
      },
      {
        timestamp: 39371.5,
        note: "SNARE",
      },
      {
        timestamp: 40061.5,
        note: "SNARE",
      },
      {
        timestamp: 40751.40000003576,
        note: "SNARE",
      },
      {
        timestamp: 41441.5,
        note: "SNARE",
      },
      {
        timestamp: 42161.30000001192,
        note: "SNARE",
      },
      {
        timestamp: 43101.40000003576,
        note: "SNARE",
      },
      {
        timestamp: 43801.5,
        note: "SNARE",
      },
      {
        timestamp: 44511.5,
        note: "SNARE",
      },
    ],
    score: [
      [
        { notes: ["SNARE"] },
        { notes: ["SNARE"] },
        { notes: ["SNARE"] },
        { notes: ["SNARE"] },
      ],
    ],
    graceTime: 100,
  };
  const final = [];
  for (const tick of props.ticks) {
    const start = tick - props.graceTime;
    const end = tick + props.graceTime;

    let match = 0;
    for (const notePlayed of props.notesPlayed) {
      if (notePlayed.timestamp >= start && notePlayed.timestamp <= end) {
        match++;
      }
    }
    final.push(match);
  }

  assert.deepStrictEqual(calculateResult(props), { missed: 9, right: 9 });
});
