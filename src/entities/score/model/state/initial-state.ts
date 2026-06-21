import { defaultMetronomeConfiguration } from "~/entities/score/model/state/defaults";
import { Score } from "../types";
import { createStave, ScoreContextValue } from "./score-state";

export type InitialState = Pick<ScoreContextValue, "configuration" | "score">;

export function getInitialStateFromHash(): Pick<ScoreContextValue, "configuration" | "score"> {
  const hash = new URLSearchParams(window.location.hash.substring(1));

  const storedScore = hash.get("score");
  if (storedScore) {
    const value = JSON.parse(JSON.parse(storedScore));
    return value.state;
  }

  const signature = hash.get("signature");
  const bpm = hash.get("bpm");
  const graceTime = hash.get("graceTime");
  const id = hash.get("id");

  const configuration = {
    signature: signature ? Number(signature) : defaultMetronomeConfiguration.signature,
    bpm: bpm ? Number(bpm) : defaultMetronomeConfiguration.bpm,
    graceTime: graceTime ? Number(graceTime) : defaultMetronomeConfiguration.graceTime,
    id: id ? Number(id) : undefined,
  };
  const scoreText = hash.get("score");
  const initialScore: Score = scoreText
    ? typeof scoreText === "string"
      ? JSON.parse(scoreText)
      : scoreText
    : [createStave(configuration.signature)];
  const score = initialScore;
  const name = hash.get("name");

  return {
    configuration: {
      ...configuration,
      name: name ?? undefined,
    },
    score,
  };
}
