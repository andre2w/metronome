import { Pencil1Icon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Box, Card, Flex, IconButton, Text, Separator } from "@radix-ui/themes";
import clsx from "clsx";
import type { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { convertToMinutes } from "~/shared/lib/time-converter";
import classes from "./region-card.module.scss";
import { useEffect, useState } from "react";
import { useRegions } from "./wave-surfer-context/use-regions";

export interface RegionProps {
  region: Region;
  index: number;
  selected?: boolean;
}

interface RegionContent {
  start: number;
  end: number;
  annotation?: string;
}

export function RegionCard({ region, index, selected = false }: RegionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { regionsPlugin } = useRegions();

  const [content, setContent] = useState<RegionContent>(toRegionContent(region));
  const [annotation, setAnnotation] = useState("");

  useEffect(() => {
    return regionsPlugin.on("region-update", (updatedRegion) => {
      if (updatedRegion.id !== region.id) {
        return;
      }

      setContent(toRegionContent(region));
    });
  }, [regionsPlugin, region]);

  return (
    <Box>
      <Card className={clsx({ [classes.selected!]: selected })}>
        <Flex direction="column" gap="2">
          <Flex direction="row" key={region.id} align="center" justify="between">
            <Flex gap="2" align="center">
              <Text as="span">
                {convertToMinutes(content.start)} - {convertToMinutes(content.end)}
              </Text>

              <Separator orientation="vertical" className={classes.separator} />

              <Text as="span">{content.annotation ?? `Region ${index + 1}`}</Text>

              {!isEditing && (
                <IconButton
                  variant="ghost"
                  aria-label={"Add annotation"}
                  className={classes.editButton}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <Pencil1Icon />
                </IconButton>
              )}
            </Flex>
          </Flex>
          {isEditing && (
            <Flex align="end" gap="1">
              <input
                type="text"
                value={content.annotation}
                onChange={(e) => {
                  setAnnotation(e.target.value);
                }}
              />
              <IconButton
                aria-label="save"
                size="1"
                onClick={() => {
                  region.setContent(annotation);
                  setIsEditing(false);
                  setAnnotation("");
                }}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                aria-label="cancel"
                variant="outline"
                size="1"
                onClick={() => {
                  setIsEditing(false);
                  setAnnotation("");
                }}
              >
                <Cross2Icon />
              </IconButton>
            </Flex>
          )}
        </Flex>
      </Card>
    </Box>
  );
}

function toRegionContent(region: Region): RegionContent {
  const initialContent = region.getContent();
  const annotation = initialContent?.toString();

  return {
    start: region.start,
    end: region.end,
    annotation,
  };
}
