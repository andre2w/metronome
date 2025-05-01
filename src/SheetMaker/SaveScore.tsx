import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useScoreContext } from "../Score/ScoreProvider";
import { db } from "../lib/storage";

export function SaveScore() {
  const { configuration, score } = useScoreContext();
  const [scoreName, setScoreName] = useState(configuration.name ?? "");
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
              if (configuration.id) {
                await db.scores.update(configuration.id, {
                  ...configuration,
                  score,
                  name: scoreName,
                });
              } else {
                await db.scores.add({
                  ...configuration,
                  score,
                  name: scoreName,
                });
              }
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
