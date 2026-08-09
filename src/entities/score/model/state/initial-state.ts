import { createBar } from "./score-state";
import { Score } from "~/shared/lib/score/score";

export function getInitialStateFromHash(): Score {
  const hash = new URLSearchParams(window.location.hash.substring(1));
  const storedScore = hash.get("score");
  console.log("STORED SCORE", storedScore);
  if (storedScore) {
    const value = JSON.parse(storedScore);
    console.log(storedScore);
    return value;
  }

  return {
    type: "score",
    author: "",
    bars: [createBar("sixteens")],
    bpm: 100,
    name: "",
  };
}
