import { Button, Dialog, Flex, Separator, Text } from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import React from "react";
import { useScoreContext } from "../Score/ScoreProvider";
import { db } from "../lib/storage";
import type { SavedScore } from "../lib/types";

export function ListScores() {
  const [isOpen, setIsOpen] = useState(false);
  const { loadScore } = useScoreContext();
  const scores = useLiveQuery(async () => {
    return await db.scores.toArray();
  });

  const deleteScore = useCallback(async (id: number) => {
    await db.scores.delete(id);
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button>List scores</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Your scores</Dialog.Title>

        <Flex direction="column" gap="2">
          {scores?.map((score, index) => {
            return (
              <React.Fragment key={score.id}>
                <ScoreRow
                  score={score}
                  onLoad={() => {
                    loadScore(score.score);
                    setIsOpen(false);
                  }}
                  onDelete={() => {
                    deleteScore(score.id);
                  }}
                />
                {index < scores.length - 1 && (
                  <Separator size="4" orientation="horizontal" />
                )}
              </React.Fragment>
            );
          })}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface ScoreRowProps {
  score: SavedScore & { id: number };
  onLoad?: () => void;
  onDelete?: () => void;
}

function ScoreRow({ score, onLoad, onDelete }: ScoreRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (isDeleting) {
    return (
      <Flex justify="between" minHeight="50px" align="center">
        <Text as="div">Do you really want to delete this score?</Text>
        <Flex align="center" gap="3">
          <Button
            onClick={() => {
              onDelete?.();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setIsDeleting(false);
            }}
            variant="soft"
          >
            No
          </Button>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex justify="between" minHeight="50px">
      <Flex direction="column">
        <Text as="div" weight="bold">
          {score.name}
        </Text>
        <Flex gap="3">
          <Text>{score.beats}BPM</Text> - <Text>1/{score.notes}</Text>
        </Flex>
      </Flex>

      <Flex align="center" gap="3">
        <Button
          onClick={() => {
            onLoad?.();
          }}
        >
          Load
        </Button>
        {onDelete && (
          <Button
            onClick={() => {
              setIsDeleting(true);
            }}
            color="crimson"
            variant="soft"
          >
            Delete
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
