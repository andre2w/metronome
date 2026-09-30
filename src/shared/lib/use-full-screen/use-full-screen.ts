import { RefObject, useCallback, useRef } from "react";

export function useFullScreenToggle(element: RefObject<HTMLElement | null>) {
  // We keep track if we are the ones that set the full screen
  const isFullScreen = useRef(false);

  const toggle = useCallback(() => {
    if (isFullScreen && document.fullscreenElement !== null) {
      void document.exitFullscreen().then(() => {
        isFullScreen.current = false;
      });
    } else {
      if (!element.current) {
        return;
      }

      if (!element.current.requestFullscreen) {
        return;
      }
      void element.current
        .requestFullscreen({
          navigationUI: "auto",
        })
        .then(() => {
          isFullScreen.current = true;
        });
    }
  }, [element]);

  return toggle;
}
