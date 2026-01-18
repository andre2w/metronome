import { Button, Dialog, Flex, Separator } from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import React from "react";
import { useScoreStore } from "../../../lib/score/state";
import { db } from "../../../lib/score/storage";
import { ScoreRow } from "./score-row";

export function ScoreList() {
  const [isOpen, setIsOpen] = useState(false);
  const loadScore = useScoreStore((state) => state.loadScore);
  const scores = useLiveQuery(async () => {
    return await db.scores.toArray();
  });

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
                    loadScore(score);
                    setIsOpen(false);
                  }}
                  onDelete={() => {
                    db.scores.delete(score.id);
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
