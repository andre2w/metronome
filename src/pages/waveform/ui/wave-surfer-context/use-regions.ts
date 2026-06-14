import { useEffect, useState } from "react";
import { useWaveSurfer } from "./use-wave-surfer";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";

// Give regions a random color when they are created
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

export function useRegions() {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [regions, setRegions] = useState<Record<string, Region>>({});
  const { regions: regionsPlugin } = useWaveSurfer();

  useEffect(() => {
    const unsubscribeClick = regionsPlugin.on("region-clicked", (event) => {
      const clickedRegion = regionsPlugin.getRegions().find((region) => region.id === event.id);
      if (clickedRegion) {
        clickedRegion.setOptions({
          color: randomColor(),
        });
      }
      setSelectedRegion(event.id);
    });
    const unsubscribeCreated = regionsPlugin.on("region-created", (e) => {
      setRegions((r) => ({ ...r, [e.id]: e }));
    });
    const unsubscribeRemoved = regionsPlugin.on("region-removed", (e) => {
      setRegions((r) => {
        const remainingRegions = { ...r };
        delete remainingRegions[e.id];
        return remainingRegions;
      });
    });
    return () => {
      unsubscribeClick();
      unsubscribeCreated();
      unsubscribeRemoved();
    };
  }, [regions]);

  return { selectedRegion, regions, regionsPlugin };
}
