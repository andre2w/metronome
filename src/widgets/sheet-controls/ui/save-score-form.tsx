import { Flex, Text, TextField, Button } from "@radix-ui/themes";
import {
  useScoreContext,
  useScoreStore,
  useScoreStoreShallow,
} from "~/entities/score/model/state/score-store-provider";
import { scoresDb } from "~/shared/lib/score/indexed-db";

export interface SaveScoreFormProps {
  onSave?: () => void;
}

export function SaveScoreForm({ onSave }: SaveScoreFormProps) {
  const updateMetadata = useScoreStore((state) => state.updateMetadata);
  const name = useScoreStoreShallow((state) => state.score.name);
  const store = useScoreContext();

  return (
    <Flex direction="column" gap="2">
      <Text as="div" size="2" mb="1" weight="bold">
        Name
      </Text>
      <TextField.Root
        placeholder="What's the name of this score?"
        value={name}
        onChange={(event) =>
          updateMetadata({
            name: event.target.value,
          })
        }
      />
      <Button
        onClick={async () => {
          if (!name) {
            return;
          }
          const score = store.getState().score;
          if (score.id) {
            await scoresDb.scores.update(score.id, {
              ...score,
            });
          } else {
            await scoresDb.scores.add({
              ...score,
            });
          }

          onSave?.();
        }}
      >
        Save
      </Button>
    </Flex>
  );
}
