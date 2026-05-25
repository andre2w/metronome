import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { db } from "~/entities/score/model/local-storage/indexed-db";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";

export function SaveScore() {
  const { configuration, onChangeConfiguration, score } = useScoreStoreShallow(
    ({ configuration, score, onChangeConfiguration }) => ({
      configuration,
      score,
      onChangeConfiguration,
    }),
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
