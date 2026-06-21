import { Theme } from "@radix-ui/themes";
import {
  render as baseRender,
  renderHook as baseRenderHook,
  queries,
  Queries,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import ReactDOMClient from "react-dom/client";
import { ConfigurationContextProvider } from "../lib/configuration/configuration-provider";
import { KEYS } from "~/entities/score/model/notes";
import { mappings } from "~/entities/midi-input/config/mappings/roland-td07";
import { ReactNode, useState } from "react";
import { TestableInputConfigurationProvider } from "./testable-input-configuration-provider";
import { ScoreContext } from "~/entities/score/model/state/score-store-provider";
import { createScoreStore } from "~/entities/score/model/state/store";
import { createTestStorage } from "./test-store";

type RendererableContainer = ReactDOMClient.Container;
type HydrateableContainer = Parameters<(typeof ReactDOMClient)["hydrateRoot"]>[0];

export function render<
  Q extends Queries = typeof queries,
  Container extends RendererableContainer | HydrateableContainer = HTMLElement,
  BaseElement extends RendererableContainer | HydrateableContainer = Container,
>(
  ui: React.ReactNode,
  options: RenderOptions<Q, Container, BaseElement>,
): { component: RenderResult<Q, Container, BaseElement>; user: UserEvent } {
  const user = userEvent.setup();
  const component = baseRender(ui, options);

  return { user, component };
}

export function renderHook<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends RendererableContainer | HydrateableContainer = HTMLElement,
  BaseElement extends RendererableContainer | HydrateableContainer = Container,
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement> | undefined,
): RenderHookResult<Result, Props> {
  const UserWrapper = options?.wrapper;

  return baseRenderHook(render, {
    ...options,
    wrapper: ({ children }) => {
      if (UserWrapper) {
        return (
          <TestWrapper>
            <UserWrapper>{children}</UserWrapper>
          </TestWrapper>
        );
      }

      return <TestWrapper>{children}</TestWrapper>;
    },
  });
}

function TestWrapper({ children }: { children: ReactNode }) {
  const [scoreStore] = useState(() => {
    return createScoreStore({
      initialState: {
        configuration: {
          bpm: 100,
          graceTime: 100,
          signature: 4,
        },
        score: [],
      },
      storage: createTestStorage(),
    });
  });

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
          <ScoreContext.Provider value={scoreStore}>{children}</ScoreContext.Provider>
          {children}
        </ConfigurationContextProvider>
      </TestableInputConfigurationProvider>
    </Theme>
  );
}
