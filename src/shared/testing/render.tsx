import {
  queries,
  RenderOptions,
  RenderResult,
  render as testingLibraryRender,
} from "@testing-library/react";
import { ReactNode } from "react";
import ReactDOMClient from "react-dom/client";
import { UserEvent, userEvent } from "@testing-library/user-event";

export type RendererableContainer = ReactDOMClient.Container;
export type HydrateableContainer = Parameters<(typeof ReactDOMClient)["hydrateRoot"]>[0];

export function render<
  Container extends RendererableContainer | HydrateableContainer = HTMLElement,
  BaseElement extends RendererableContainer | HydrateableContainer = Container,
>(
  ui: ReactNode,
  options?: RenderOptions<typeof queries, Container, BaseElement>,
): RenderResult<typeof queries, Container, BaseElement> & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...testingLibraryRender(ui, options ?? {}),
  };
}
