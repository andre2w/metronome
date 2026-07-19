import { Key } from "~/shared/lib/score/key-data";
import { Bar, FullScore, Part, Score, Sticking, Tempo } from "../types";
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

export function createStave(notes: number): Bar {
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

  const parts: Part[] = [];
  for (let i = 0; i < notes; i++) {
    parts.push({ type: "part", notes: [], tempo });
  }
  return { type: "bar", parts };
}
