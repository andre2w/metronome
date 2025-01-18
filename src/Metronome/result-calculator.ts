import { NotePlayed } from "../lib/types";

const OFFSET = 100; 

export function calculateResult({ ticks, played }: { ticks: number[], played: NotePlayed[]} ) {
  let missed = 0;
  let right = 0;
  let index = 0
  while (index < ticks.length) {
    const expectedTick = ticks[index]!;

    if (played.length === 0) {
      missed++;
      index++;
      continue;
    }

    const actualPlayed = played[0].timestamp;

    if (actualPlayed == undefined) {
      missed++;
      continue;
    }
    if (actualPlayed < expectedTick - OFFSET) {
      missed++;
      played.shift();
      continue;
    } else if (actualPlayed > expectedTick + OFFSET) {
      index++;
      continue;
    } else {
      right++;
      index++;
      played.shift();
    }
  }

  return { right, missed };
}