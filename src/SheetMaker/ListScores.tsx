import { Button, Dialog, Flex, Heading, Separator, Text, TextField } from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useURLHash } from "../hooks/useURLHash";
import { db } from "../lib/storage";

export function ListScores() {
  const [isOpen, setIsOpen] = useState(false);
  const { setHash, hash } = useURLHash();
  const scores = useLiveQuery(async () => {
    return await db.scores.toArray();
  });

  return <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
    <Dialog.Trigger>
      <Button>List scores</Button>
    </Dialog.Trigger>

    <Dialog.Content>
      <Dialog.Title>Your scores</Dialog.Title>

      <Flex direction="column" gap="2">
        {scores?.map((score, index) => {
          // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          return <><Flex justify="between">
            <Flex direction="column">
              <Text as="div" weight="bold">{score.name}</Text>
              <Flex gap="3">
                <Text>{score.beats}BPM</Text>
                -
                <Text>1/{score.notes}</Text>
              </Flex>
            </Flex>

            <Button onClick={() => {
              const newHash = new URLSearchParams(hash);
              newHash.set("score", JSON.stringify(score.score));
              setHash(newHash);
              setIsOpen(false);
            }} style={{ alignSelf: "center"}}>Load</Button>
          </Flex>
          {(index < scores.length - 1) && <Separator size="4" orientation="horizontal" />}
          </>
        })}
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
}