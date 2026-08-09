import { StateStorage } from "zustand/middleware";
import { Score } from "~/shared/lib/score/score";

export const queryParamsStorage: StateStorage<Score> = {
  getItem: (key): string => {
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    const value = urlSearchParams.get(key);
    return value ?? "";
  },
  setItem: (key, newValue) => {
    const state = JSON.parse(newValue);
    const score = state.state.score;
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    urlSearchParams.set(key, JSON.stringify(score));
    location.hash = urlSearchParams.toString();
    return state.state.score;
  },
  removeItem: (key) => {
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    const scoreParam = urlSearchParams.get(key);
    if (scoreParam) {
      urlSearchParams.delete(key);
      location.hash = urlSearchParams.toString();
      return JSON.parse(scoreParam);
    }

    return {
      type: "score",
      name: "",
      author: "",
      bars: [],
      bpm: 60,
    };
  },
};
