import { Pencil1Icon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Box, Card, Flex, IconButton, Text, Separator } from "@radix-ui/themes";
import clsx from "clsx";
import type { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { convertToMinutes } from "~/shared/lib/time-converter";
import classes from "./region-card.module.scss";
import { useState } from "react";

export interface RegionProps {
  region: Region;
  index: number;
  selected?: boolean;
}

export function RegionCard({ region, index, selected = false }: RegionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(() => {
    const initialContent = region.getContent();
    return initialContent?.toString();
  });

  return (
    <Box>
      <Card>
        <Flex direction="column" gap="2">
          <Flex
            direction="row"
            className={clsx({ [classes.selected!]: selected })}
            key={region.id}
            align="center"
            justify="between"
          >
            <Flex gap="2" align="center">
              <Text as="span">
                {convertToMinutes(region.start)} - {convertToMinutes(region.end)}
              </Text>

              <Separator orientation="vertical" className={classes.separator} />

              <Text as="span">{content ?? `Region ${index + 1}`}</Text>

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
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <IconButton
                aria-label="save"
                size="1"
                onClick={() => {
                  region.setContent(content);
                  setIsEditing(false);
                  setContent("");
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
                  setContent("");
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
