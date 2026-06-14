import { Flex } from "@radix-ui/themes";
import { useRegions } from "./wave-surfer-context/use-regions";
import { RegionCard } from "./region-card";

export function Regions() {
  const { regions, selectedRegion } = useRegions();

  return (
    <Flex pt="3" gap="2">
      {regions.map((region, index) => {
        return (
          <RegionCard
            region={region}
            index={index}
            key={region.id}
            selected={region.id === selectedRegion}
          />
        );
      })}
    </Flex>
  );
}
