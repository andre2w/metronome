import { Key } from "~/shared/lib/score/key-data";
import { Bar, Note, Part, Score, Tempo } from "~/shared/lib/score/score";
import { Sticking } from "~/shared/lib/score/sticking";

export interface ScoreContextValue {
  score: Score & { id?: number };
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
  changeTempo: (props: { index: { barIndex: number; partIndex: number }; tempo: Tempo }) => void;
}

export function createBar(tempo: Tempo): Bar {
  const notesPerPart = notesForTempo(tempo);
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

export function createPart(tempo: Tempo): Part {
  const notesPerPart = notesForTempo(tempo);
  const notes: Note[] = [];
  for (let i = 0; i < notesPerPart; i++) {
    notes.push({ type: "note", keys: [], sticking: undefined });
  }

  return {
    type: "part",
    notes,
    tempo,
  };
}

function notesForTempo(tempo: Tempo) {
  switch (tempo) {
    case "quarter":
      return 1;
    case "eights":
      return 2;
    case "triplet":
      return 3;
    case "sixteens":
      return 4;
    default:
      throw new Error("Invalid number of notes per part");
  }
}
