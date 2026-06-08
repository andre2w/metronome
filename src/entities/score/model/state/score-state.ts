import { Key } from "~/shared/lib/score/key-data";
import { FullScore, NotesWithSticking, Score, Sticking } from "../types";
import { MetronomeConfigurationProps } from "~/entities/score/model/state/defaults";

export interface ScoreContextValue {
  score: Score;
  addStave: () => void;
  toggleNote: (props: { staveIndex: number; staveNoteIndex: number; note: Key }) => void;
  removeStave: (staveIndex: number) => void;
  setSticking: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: FullScore & { id: number }) => void;
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
  onChangeConfiguration: (configuration: MetronomeConfigurationProps & { name?: string }) => void;
  clear: () => void;
}

export function createStave(notes: number) {
  return Array.from<NotesWithSticking>({ length: notes }).fill({
    notes: [],
  });
}
