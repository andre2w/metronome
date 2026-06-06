import { createFileRoute } from "@tanstack/react-router";
import { WaveformView } from "./ui/waveform-view";

export const Route = createFileRoute("/waveform")({
  component: WaveformView,
});
