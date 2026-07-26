import { Key } from "~/shared/lib/score/key-data";
import { Bar, FullScore, Note, Part, Score, Sticking, Tempo } from "../types";
import { MetronomeConfigurationProps } from "~/entities/score/model/state/defaults";

export interface ScoreContextValue {
  score: Score;
  addStave: () => void;
  toggleNote: (props: { barIndex: number; partIndex: number; noteIndex: number; key: Key }) => void;
  removeStave: (staveIndex: number) => void;
  setSticking: (props: {
    barIndex: number;
    partIndex: number;
    noteIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: FullScore & { id: number }) => void;
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
  onChangeConfiguration: (configuration: MetronomeConfigurationProps & { name?: string }) => void;
  clear: () => void;
}

export function createBar(notes: number): Bar {
  let tempo: Tempo | undefined;
  switch (notes) {
    case 4:
      tempo = "quarter";
      break;
    case 8:
      tempo = "eights";
      break;
    case 3:
      tempo = "triplet";
      break;
    case 16:
      tempo = "sixteens";
      break;
  }

  if (!tempo) {
    throw new Error("Could not translate value into tempo");
  }

  let notesPerPart: number;
  switch (notes) {
    case 4:
      notesPerPart = 1;
      break;
    case 8:
      notesPerPart = 2;
      break;
    case 3:
      notesPerPart = 3;
      break;
    case 16:
      notesPerPart = 4;
      break;
    default:
      throw new Error("Invalid number of notes per part");
  }

  const parts: Part[] = [];
  for (let i = 0; i < notes; i++) {
    const notes: Note[] = [];
    for (let i = 0; i < notesPerPart; i++) {
      notes.push({ type: "note", keys: [], sticking: undefined });
    }
    parts.push({ type: "part", notes, tempo });
  }
  return { type: "bar", parts };
}
