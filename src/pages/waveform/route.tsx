import { createFileRoute } from "@tanstack/react-router";
import { WaveformView } from "./ui/waveform-view";
import { WaveSurferProvider } from "./ui/wave-surfer-context/provider";

function WaveFormRoute() {
  return (
    <WaveSurferProvider>
      <WaveformView />
    </WaveSurferProvider>
  );
}

export const Route = createFileRoute("/waveform")({
  component: WaveFormRoute,
});
