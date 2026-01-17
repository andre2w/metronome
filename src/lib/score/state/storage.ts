import type { StateStorage } from "zustand/middleware";
import type { Score } from "../types";
import type { ScoreContextValue } from "./types";
import { createStave } from "./utils";
import { defaultMetronomeConfiguration } from "../../metronome-store";

export const urlHashStorage: StateStorage = {
  getItem: (key): string => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    const value = urlSearchParams.get(key);
    return value ?? "";
  },
  setItem: (key, newValue): void => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    urlSearchParams.set(key, JSON.stringify(newValue));
    location.hash = urlSearchParams.toString();
  },
  removeItem: (key): void => {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.substring(1),
    );
    urlSearchParams.delete(key);
    location.hash = urlSearchParams.toString();
  },
};

export function getInitialState(): Pick<
  ScoreContextValue,
  "configuration" | "score"
> {
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

  console.log("Building configuration", { signature, bpm, graceTime, id });
  const configuration = {
    signature: (signature
      ? Number(signature)
      : defaultMetronomeConfiguration.signature) as 4 | 8 | 16,
    bpm: bpm ? Number(bpm) : defaultMetronomeConfiguration.bpm,
    graceTime: graceTime
      ? Number(graceTime)
      : defaultMetronomeConfiguration.graceTime,
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
