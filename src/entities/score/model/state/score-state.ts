import { Key } from "~/shared/lib/score/key-data";
import { Bar, Note, Part, Score, Tempo } from "~/shared/lib/score/score";
import { Sticking } from "~/shared/lib/score/sticking";

export interface ScoreContextValue {
  score: Score;
  addBar: () => void;
  toggleNote: (props: { barIndex: number; partIndex: number; noteIndex: number; key: Key }) => void;
  removeBar: (barIndex: number) => void;
  setSticking: (props: {
    barIndex: number;
    partIndex: number;
    noteIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: Score) => void;
  clear: () => void;
  updateMetadata: (props: Partial<Pick<Score, "author" | "name" | "bpm">>) => void;
}

export function createBar(tempo: Tempo): Bar {
  let notesPerPart: number;
  switch (tempo) {
    case "quarter":
      notesPerPart = 1;
      break;
    case "eights":
      notesPerPart = 2;
      break;
    case "triplet":
      notesPerPart = 3;
      break;
    case "sixteens":
      notesPerPart = 4;
      break;
    default:
      throw new Error("Invalid number of notes per part");
  }

  const parts: Part[] = [];
  for (let i = 0; i < 4; i++) {
    const notes: Note[] = [];
    for (let i = 0; i < notesPerPart; i++) {
      notes.push({ type: "note", keys: [], sticking: undefined });
    }
    parts.push({ type: "part", notes, tempo });
  }
  return { type: "bar", parts };
}
