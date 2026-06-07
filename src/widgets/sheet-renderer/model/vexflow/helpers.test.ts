import { calculateWidthAndPosition } from "./helpers";
import { describe, test, expect } from "vitest";

describe("calculateHeightAndPosition", () => {
  test("should return empty array in case there are no staves", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 0,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([]);
  });

  test("should take entire sheet width in case there's only a single stave", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 1,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([{ y: 0, x: 0, width: 900 }]);
  });

  test("should put staves next to each other", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 3,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([
      { y: 0, x: 0, width: 300 },
      { y: 0, x: 300, width: 300 },
      { y: 0, x: 600, width: 300 },
    ]);
  });

  test("should put staves into multiple lines", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 6,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([
      { y: 0, x: 0, width: 300 },
      { y: 0, x: 300, width: 300 },
      { y: 0, x: 600, width: 300 },
      { y: 150, x: 0, width: 300 },
      { y: 150, x: 300, width: 300 },
      { y: 150, x: 600, width: 300 },
    ]);
  });

  test("should resize staves fill width of the sheet when is not enough to fill the line", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 5,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([
      { y: 0, x: 0, width: 300 },
      { y: 0, x: 300, width: 300 },
      { y: 0, x: 600, width: 300 },
      { y: 150, x: 0, width: 450 },
      { y: 150, x: 450, width: 450 },
    ]);
    expect(
      calculateWidthAndPosition({
        sheetWidth: 900,
        staveCount: 5,
        staveHeight: 150,
        staveWidth: 310,
      }),
    ).toEqual([
      { y: 0, x: 0, width: 450 },
      { y: 0, x: 450, width: 450 },
      { y: 150, x: 0, width: 450 },
      { y: 150, x: 450, width: 450 },
      { y: 300, x: 0, width: 900 },
    ]);
  });

  test("should handle cases where numbers are not integers", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 1450,
        staveCount: 3,
        staveHeight: 150,
        staveWidth: 300,
      }),
    ).toEqual([
      { width: 483, x: 0, y: 0 },
      { width: 483, x: 483, y: 0 },
      { width: 483, x: 966, y: 0 },
    ]);
  });

  test("edge case that had recursion Here", () => {
    expect(
      calculateWidthAndPosition({
        sheetWidth: 2407.33349609375,
        staveCount: 7,
        staveHeight: 150,
        staveWidth: 343,
        startY: 10,
        startX: 10,
      }),
    ).toEqual([
      { y: 10, x: 10, width: 343 },
      { y: 10, x: 353, width: 343 },
      { y: 10, x: 696, width: 343 },
      { y: 10, x: 1039, width: 343 },
      { y: 10, x: 1382, width: 343 },
      { y: 10, x: 1725, width: 343 },
      { y: 10, x: 2068, width: 343 },
    ]);
  });
});
