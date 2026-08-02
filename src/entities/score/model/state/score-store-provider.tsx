import { createContext, ReactNode, useContext, useState } from "react";
import { createScoreSlice } from "./store";
import { getInitialStateFromHash } from "./initial-state";
import { useStore } from "zustand/react";
import { ScoreContextValue } from "./score-state";
import { useShallow } from "zustand/react/shallow";
import { queryParamsStorage } from "./query-params-storage";
import { createStore, StoreApi } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage } from "zustand/middleware";
import { createMetronomeSlice } from "~/entities/metronome/model/store";
import { MetronomeValues } from "~/shared/lib/metronome";

export const ScoreContext = createContext<
  StoreApi<ScoreContextValue & MetronomeValues> | undefined
>(undefined);

export interface ScoreProviderProps {
  children: ReactNode;
}

export function ScoreProvider({ children }: ScoreProviderProps) {
  const [scoreStore] = useState(() => {
    return createStore<ScoreContextValue & MetronomeValues>()(
      persist(
        immer((...args) => ({
          ...createScoreSlice(getInitialStateFromHash())(...args),
          ...createMetronomeSlice(...args),
        })),
        {
          name: "score",
          storage: createJSONStorage(() => queryParamsStorage),
        },
      ),
    );
  });

  return <ScoreContext.Provider value={scoreStore}>{children}</ScoreContext.Provider>;
}

export function useScoreStore<U>(selector: (state: ScoreContextValue & MetronomeValues) => U) {
  const score = useContext(ScoreContext);
  if (!score) {
    throw new Error("ScoreContext is not set");
  }
  return useStore(score, selector);
}

export function useScoreStoreShallow<U>(
  selector: (state: ScoreContextValue & MetronomeValues) => U,
) {
  const score = useContext(ScoreContext);
  if (!score) {
    throw new Error("ScoreContext is not set");
  }
  return useStore(score, useShallow(selector));
}
