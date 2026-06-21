import { createContext, ReactNode, useContext, useState } from "react";
import { createScoreStore } from "./store";
import { getInitialStateFromHash } from "./initial-state";
import { useStore } from "zustand/react";
import { ScoreContextValue } from "./score-state";
import { useShallow } from "zustand/react/shallow";
import { queryParamsStorage } from "./query-params-storage";

export const ScoreContext = createContext(
  createScoreStore({
    initialState: {
      configuration: {
        bpm: 100,
        graceTime: 100,
        signature: 4,
      },
      score: [],
    },
    storage: queryParamsStorage,
  }),
);

export interface ScoreProviderProps {
  children: ReactNode;
}

export function ScoreProvider({ children }: ScoreProviderProps) {
  const [scoreStore] = useState(() => {
    return createScoreStore({
      initialState: getInitialStateFromHash(),
      storage: queryParamsStorage,
    });
  });

  return <ScoreContext.Provider value={scoreStore}>{children}</ScoreContext.Provider>;
}

export function useScoreStore<U>(selector: (state: ScoreContextValue) => U) {
  const score = useContext(ScoreContext);
  return useStore(score, selector);
}

export function useScoreStoreShallow<U>(selector: (state: ScoreContextValue) => U) {
  const score = useContext(ScoreContext);
  return useStore(score, useShallow(selector));
}
