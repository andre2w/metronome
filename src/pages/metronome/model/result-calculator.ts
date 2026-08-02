import { NotePlayed } from "~/shared/lib/score/note-played";
import { Key } from "~/shared/lib/score/key-data";
import { Score } from "~/shared/lib/score/score";

export interface CalculateResultProps {
  ticks: number[];
  notesPlayed: NotePlayed[];
  score: Pick<Score, "bars">;
  graceTime: number;
}

export function calculateResult({
  ticks,
  notesPlayed,
  score: baseScore,
  graceTime,
}: CalculateResultProps) {
  let right = 0;
  let missed = 0;
  let tickIndex = 0;
  let notesPlayedIndex = 0;
  let scoreIndex = 0;
  let barIndex = 0;
  notesPlayed.sort((a, b) => a.timestamp - b.timestamp);
  const score = baseScore.bars.flatMap((s) => s.parts.map((p) => p.notes));

  if (!score.length) {
    return { missed: 0, right: 0 };
  }

  while (tickIndex < ticks.length) {
    const timestamp = ticks[tickIndex];
    if (!timestamp) {
      throw new Error();
    }

    const start = timestamp - graceTime;
    const end = timestamp + graceTime;

    const notesInTime: Key[] = [];

    while (notesPlayedIndex < notesPlayed.length) {
      const note = notesPlayed[notesPlayedIndex];
      if (!note) {
        break;
      }

      if (note.timestamp >= start && note.timestamp <= end) {
        notesInTime.push(note.note);
        notesPlayedIndex++;
      } else if (start > note.timestamp) {
        notesPlayedIndex++;
      } else {
        break;
      }
    }

    const expectedNotes = score[scoreIndex]?.[barIndex]?.keys;
    if (!expectedNotes) {
      throw new Error(`Could not find notes for index ${scoreIndex} - ${barIndex}`);
    }

    barIndex++;
    const barLength = score[scoreIndex]?.length;

    if (!barLength) {
      throw new Error(`No bar for index: ${scoreIndex}`);
    }

    if (barIndex >= barLength) {
      barIndex = 0;
      scoreIndex++;
      if (scoreIndex >= score.length) {
        scoreIndex = 0;
      }
    }
    tickIndex++;

    const matchAllExpectedNotes = expectedNotes.every((n) =>
      notesInTime.some(
        (noteInTime) => n.note === noteInTime.note && n.modifier === noteInTime.modifier,
      ),
    );
    if (notesInTime.length === expectedNotes.length && matchAllExpectedNotes) {
      right++;
    } else {
      missed++;
    }
  }

  return { missed, right };
}
