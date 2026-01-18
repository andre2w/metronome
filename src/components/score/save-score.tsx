import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useScoreStore } from "../../lib/score/state";
import { useShallow } from "zustand/shallow";
import { db } from "../../lib/score/storage";

export function SaveScore() {
  const { configuration, score, onChangeConfiguration } = useScoreStore(
    useShallow(({ configuration, score, onChangeConfiguration }) => ({
      configuration,
      score,
      onChangeConfiguration,
    })),
  );
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
            value={configuration.name}
            onChange={(event) =>
              onChangeConfiguration({
                ...configuration,
                name: event.target.value,
              })
            }
          />
          <Button
            onClick={async () => {
              if (!configuration.name) {
                return;
              }

              if (configuration.id) {
                await db.scores.update(configuration.id, {
                  ...configuration,
                  score,
                });
              } else {
                await db.scores.add({
                  ...configuration,
                  score,
                  name: configuration.name,
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
