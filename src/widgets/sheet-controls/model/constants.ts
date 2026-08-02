import { Tempo } from "~/shared/lib/score/score";

export const counting: Record<Tempo, string[][]> = {
  quarter: [["1"], ["2"], ["3"], ["4"]],
  eights: [
    ["1", "&"],
    ["2", "&"],
    ["3", "&"],
    ["4", "&"],
  ],
  sixteens: [
    ["1", "e", "&", "a"],
    ["2", "e", "&", "a"],
    ["3", "e", "&", "a"],
    ["4", "e", "&", "a"],
  ],
  triplet: [
    ["1", "ta", "ta"],
    ["2", "ta", "ta"],
    ["3", "ta", "ta"],
  ],
};
