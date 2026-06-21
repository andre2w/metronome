import { Key } from "~/shared/lib/score/key-data";
import { FullScore, Part, Score, Sticking, Tempo } from "../types";
import { MetronomeConfigurationProps } from "~/entities/score/model/state/defaults";

export interface ScoreContextValue {
  score: Score;
  addStave: () => void;
  toggleNote: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    partIndex: number;
    note: Key;
  }) => void;
  removeStave: (staveIndex: number) => void;
  setSticking: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    partIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: FullScore & { id: number }) => void;
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
  onChangeConfiguration: (configuration: MetronomeConfigurationProps & { name?: string }) => void;
  clear: () => void;
}

export function createStave(notes: number) {
  let tempo: Tempo | undefined;
  switch (notes) {
    case 1:
      tempo = "quarter";
      break;
    case 2:
      tempo = "eights";
      break;
    case 3:
      tempo = "triplet";
      break;
    case 4:
      tempo = "sixteens";
      break;
  }

  if (!tempo) {
    throw new Error("Could not translate value into tempo");
  }

  return Array.from<Part>({ length: notes }).fill({
    notes: [],
    tempo,
  });
}
