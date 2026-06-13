import { rootRoute, index, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("./app/entrypoint/root.tsx", [
  index("./pages/metronome/route.tsx"),
  route("/waveform", "./pages/waveform/route.tsx"),
]);
