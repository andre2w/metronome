import { rootRoute, index } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("./app/entrypoint/root.tsx", [
  index("./pages/metronome/route.tsx"),
]);
