import test from "node:test";
import assert from "node:assert";
import { NotePlayed, Score } from "./types";
import { calculateResult } from "./result-calculator";

test("calculate results for simple score with a single part being played", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed = [
    { timestamp: 10, note: 100 },
    { timestamp: 15, note: 100 },
    { timestamp: 20, note: 100 },
    { timestamp: 25, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 35, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 50, note: 100 },
  ];
  const score: Score = [
    [[100], [100], [100], [100]],
    [[100], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 0, right: 8 });
});

test("calculate results for simple scores with multiple parts being played", { only: true }, () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed = [
    { timestamp: 10, note: 100 },
    { timestamp: 10, note: 150 },
    { timestamp: 15, note: 100 },
    { timestamp: 20, note: 100 },
    { timestamp: 25, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 30, note: 150 },
    { timestamp: 35, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 50, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 0, right: 8 });
});

test("counts as a miss if there's a missing part in the tick", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed = [
    { timestamp: 10, note: 100 },
    { timestamp: 15, note: 100 },
    { timestamp: 20, note: 100 },
    { timestamp: 25, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 30, note: 150 },
    { timestamp: 35, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 50, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 1, right: 7 });
});

test("counts as a miss if more parts are played during a tick", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed = [
    { timestamp: 10, note: 100 },
    { timestamp: 10, note: 150 },
    { timestamp: 10, note: 200 },
    { timestamp: 15, note: 100 },
    { timestamp: 20, note: 100 },
    { timestamp: 25, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 30, note: 150 },
    { timestamp: 35, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 50, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 1, right: 7 });
});

test("group notes for a tick inside the grace time", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed = [
    { timestamp: 9, note: 100 },
    { timestamp: 12, note: 150 },
    { timestamp: 20, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 49, note: 100 },
    { timestamp: 51, note: 150 },
    { timestamp: 60, note: 100 },
    { timestamp: 70, note: 100 },
    { timestamp: 80, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 2 }), { missed: 0, right: 8 });
});

test("loops through the score when the number of ticks is greater than entire score", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed = [
    { timestamp: 9, note: 100 },
    { timestamp: 12, note: 150 },
    { timestamp: 20, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 49, note: 100 },
    { timestamp: 51, note: 150 },
    { timestamp: 60, note: 100 },
    { timestamp: 70, note: 100 },
    { timestamp: 80, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 2 }), { missed: 0, right: 8 });
});

test("only counts ticks and ignore rest of score if not played entirely", () => {
  const ticks = [10, 20, 30, 40, 50, 60, 70, 80];
  const notesPlayed = [
    { timestamp: 9, note: 100 },
    { timestamp: 12, note: 150 },
    { timestamp: 20, note: 100 },
    { timestamp: 30, note: 100 },
    { timestamp: 40, note: 100 },
    { timestamp: 49, note: 100 },
    { timestamp: 51, note: 150 },
    { timestamp: 60, note: 100 },
    { timestamp: 70, note: 100 },
    { timestamp: 80, note: 100 },
  ];
  const score: Score = [
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]],
    [[100, 150], [100], [100], [100]],
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 2 }), { missed: 0, right: 8 });
});

test("calculates results when user start to play later", () => {
  const ticks = [
    10, 15, 20, 25, 30, 35, 40, 50,
    100, 101, 102, 103, 104, 105, 106, 107
  ];
  const notesPlayed = [
    { timestamp: 100, note: 100 },
    { timestamp: 101, note: 100 },
    { timestamp: 102, note: 100 },
    { timestamp: 103, note: 100 },
    { timestamp: 104, note: 100 },
    { timestamp: 105, note: 100 },
    { timestamp: 106, note: 100 },
    { timestamp: 107, note: 100 },
  ];
  const score: Score = [
    [[100], [100], [100], [100]],
    [[100], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 8, right: 8 });
});

test("when no notes were played", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [];
  const score: Score = [
    [[100], [100], [100], [100]],
    [[100], [100], [100], [100]]
  ];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 8, right: 0 });
});

test("when there is no score", () => {
  const ticks = [10, 15, 20, 25, 30, 35, 40, 50];
  const notesPlayed: NotePlayed[] = [];
  const score: Score = [];

  assert.deepStrictEqual(calculateResult({ ticks, notesPlayed, score, graceTime: 0 }), { missed: 0, right: 0 });
})

test("real world example", { only: true }, () => {
const props = {
  ticks: [
    31710.5,
    32460,
    33210.200000047684,
    33959.80000001192,
    34710.60000002384,
    35460.200000047684,
    36210.80000001192,
    36960.700000047684,
    37709.5,
    38460,
    39209.60000002384,
    39959.90000003576,
    40710.200000047684,
    41459.5,
    42209.90000003576,
    42959.700000047684,
    43710.200000047684,
    44459.90000003576
  ],
  notesPlayed: [
      {
        timestamp: 31941.600000023842,
        note: 38
      },
      {
        timestamp: 32581.600000023842,
        note: 38
      },
      {
        timestamp: 33231.60000002384,
        note: 38
      },
      {
        timestamp: 33921.5,
        note: 38
      },
      {
        timestamp: 34581.40000003576,
        note: 38
      },
      {
        timestamp: 35261.60000002384,
        note: 38
      },
      {
        timestamp: 36031.60000002384,
        note: 38
      },
      {
        timestamp: 36871.60000002384,
        note: 38
      },
      {
        timestamp: 37761.60000002384,
        note: 38
      },
      {
        timestamp: 38601.5,
        note: 38
      },
      {
        timestamp: 39371.5,
        note: 38
      },
      {
        timestamp: 40061.5,
        note: 38
      },
      {
        timestamp: 40751.40000003576,
        note: 38
      },
      {
        timestamp: 41441.5,
        note: 38
      },
      {
        timestamp: 42161.30000001192,
        note: 38
      },
      {
          timestamp: 43101.40000003576,
          note: 38
      },
      {
          timestamp: 43801.5,
          note: 38
      },
      {
          timestamp: 44511.5,
          note: 38
      }
  ],
  score: [[[38], [38], [38], [38]]],
  graceTime: 100
}
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

  console.log("FINAL", final);
  console.log("calculated", calculateResult(props));
});
