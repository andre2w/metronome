import { Theme } from "@radix-ui/themes";
import { ConfigurationContextProvider } from "../lib/configuration/configuration-provider";
import { KEYS } from "~/entities/score/model/notes";
import { mappings } from "~/entities/midi-input/config/mappings/roland-td07";
import { type ReactNode, useState } from "react";
import { TestableInputConfigurationProvider } from "./testable-input-configuration-provider";
import {
  ScoreContext,
  ScoreProviderProps,
} from "~/entities/score/model/state/score-store-provider";
import { StateStorage } from "zustand/middleware";
import { MetronomeValues } from "../lib/metronome";
import { ScoreContextValue } from "~/entities/score/model/state/score-state";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScoreSlice } from "~/entities/score/model/state/store";
import { createMetronomeSlice } from "~/entities/metronome/model/store";
import { createJSONStorage } from "zustand/middleware";
import {
  render as baseRender,
  renderHook as baseRenderHook,
  ComponentRenderOptions,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  RenderResult,
} from "vitest-browser-react";

export async function render(ui: React.ReactNode, options?: RenderOptions): Promise<RenderResult> {
  return await baseRender(ui, {
    ...options,
    wrapper: createWrapper(options?.wrapper),
  });
}

export async function renderHook<Props, Result>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
): Promise<RenderHookResult<Result, Props>> {
  return baseRenderHook(render as (initialProps?: Props) => Result, {
    ...options,
    wrapper: createWrapper(options?.wrapper),
  });
}

function TestScoreProvider({ children }: ScoreProviderProps) {
  const [scoreStore] = useState(() => {
    return createStore<ScoreContextValue & MetronomeValues>()(
      persist(
        immer((...args) => ({
          ...createScoreSlice()(...args),
          ...createMetronomeSlice(...args),
        })),
        {
          name: "score",
          storage: createJSONStorage(() => createStorage()),
        },
      ),
    );
  });

  return <ScoreContext.Provider value={scoreStore}>{children}</ScoreContext.Provider>;
}

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <Theme
      accentColor={"amber"}
      grayColor="sand"
      panelBackground="solid"
      radius="none"
      scaling="100%"
      appearance={"dark"}
    >
      <TestableInputConfigurationProvider>
        <ConfigurationContextProvider keyMap={KEYS} mappings={mappings}>
          <TestScoreProvider>{children}</TestScoreProvider>
        </ConfigurationContextProvider>
      </TestableInputConfigurationProvider>
    </Theme>
  );
}

function createStorage(): StateStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (key) => {
      return storage.get(key) ?? "";
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    setItem: (key, value) => {
      storage.set(key, JSON.stringify(value));
    },
  };
}

function createWrapper(wrapper: ComponentRenderOptions["wrapper"]) {
  const UserWrapper = wrapper;
  return ({ children }: { children: ReactNode }) => {
    if (UserWrapper) {
      return (
        <TestWrapper>
          <UserWrapper>{children}</UserWrapper>
        </TestWrapper>
      );
    }

    return <TestWrapper>{children}</TestWrapper>;
  };
}
