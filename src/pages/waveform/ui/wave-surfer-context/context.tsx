import { createContext, RefObject } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

export interface WaveSurferContextValue {
  isLoaded: boolean;
  init: (element: HTMLElement) => void;
  loadFile: (file: string | Blob) => Promise<void>;
  playPause: () => Promise<void>;
  waveSurferRef: RefObject<WaveSurfer | undefined>;
  regions: RegionsPlugin;
}

export const WaveSurferContext = createContext<WaveSurferContextValue | undefined>(undefined);
