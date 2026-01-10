import type { MetronomeConfigurationProps } from "../../../Metronome/configuration";
import type { FullScore, Note, Score, Sticking } from "../types";

export interface ScoreContextValue {
  score: Score;
  addStave: () => void;
  toggleNote: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    note: Note;
  }) => void;
  removeStave: (staveIndex: number) => void;
  setSticking: (props: {
    staveIndex: number;
    staveNoteIndex: number;
    sticking: Sticking | null;
  }) => void;
  loadScore: (score: FullScore & { id: number }) => void;
  configuration: MetronomeConfigurationProps & { id?: number; name?: string };
  onChangeConfiguration: (
    configuration: MetronomeConfigurationProps & { name?: string },
  ) => void;
  clear: () => void;
}
