import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";

export function SaveScore() {
  const { score, updateMetadata } = useScoreStoreShallow(({ score, updateMetadata }) => ({
    score,
    updateMetadata,
  }));
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
            value={score.name}
            onChange={(event) =>
              updateMetadata({
                name: event.target.value,
              })
            }
          />
          <Button
            onClick={async () => {
              if (!score.name) {
                return;
              }

              // TODO
              // if (score.id) {
              //   await db.scores.update(configuration.id, {
              //     ...configuration,
              //     score,
              //   });
              // } else {
              //   await db.scores.add({
              //     ...configuration,
              //     score,
              //     name: configuration.name,
              //   });
              // }
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
