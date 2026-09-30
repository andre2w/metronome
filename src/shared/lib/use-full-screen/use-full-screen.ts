import { RefObject, useCallback } from "react";

export function useFullScreenToggle(element: RefObject<HTMLElement | null>) {
  const toggle = useCallback(() => {
    if (document.fullscreenElement !== null) {
      void document.exitFullscreen();
    } else {
      if (!element.current) {
        return;
      }
      void element.current.requestFullscreen({
        navigationUI: "auto",
      });
    }
  }, [element]);

  return toggle;
}
