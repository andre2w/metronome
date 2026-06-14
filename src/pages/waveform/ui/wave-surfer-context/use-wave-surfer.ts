import { useContext } from "react";
import { WaveSurferContext } from "./context";

export function useWaveSurfer() {
  const context = useContext(WaveSurferContext);
  if (!context) {
    throw new Error("WaveSurferContext is not set up");
  }

  return context;
}
