import { useEffect } from "react";

/**
 * Keeps the screen awake while `active` is true using the Screen Wake Lock API.
 *
 * The lock is released automatically by the browser when the tab is hidden
 * (e.g. switching apps), so we re-acquire it on `visibilitychange` while still
 * active. The lock is always released on stop or unmount.
 *
 * No-ops gracefully on browsers/contexts without `navigator.wakeLock`
 * (the API requires a secure context).
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    let sentinel: WakeLockSentinel | undefined;
    let released = false;

    const request = async () => {
      try {
        sentinel = await navigator.wakeLock.request("screen");
      } catch {
        // Request can reject (e.g. tab not visible, low battery, unsupported).
        // A wake lock is best-effort, so we swallow the error.
      }
    };

    const handleVisibilityChange = () => {
      if (!released && document.visibilityState === "visible") {
        void request();
      }
    };

    void request();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void sentinel?.release().catch(() => {
        // Ignore release errors — the lock may already be gone.
      });
    };
  }, [active]);
}
