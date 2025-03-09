import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { db } from "../lib/storage";
import type { SavedScore } from "../lib/types";

export type SaveScoreProps = Omit<SavedScore, "name">;

export function SaveScore(props: SaveScoreProps) {
  const [scoreName, setScoreName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button>Save Sheet</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Save sheet</Dialog.Title>

        <Flex direction="column" gap="2">
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root
            placeholder="What's the name of this score?"
            value={scoreName}
            onChange={(event) => setScoreName(event.target.value)}
          />
          <Button
            onClick={async () => {
              await db.scores.add({ ...props, name: scoreName });
              setScoreName("");
              setIsOpen(false);
            }}
          >
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
