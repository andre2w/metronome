import { Button, Flex, Text } from "@radix-ui/themes";
import { FullScore } from "../../../lib/score/types";

interface ScoreRowViewProps {
  score: FullScore;
  onLoad: () => void;
  onDelete: () => void;
}

export function ScoreRowView({ score, onLoad, onDelete }: ScoreRowViewProps) {
  return (
    <>
      <Flex direction="column">
        <Text as="div" weight="bold">
          {score.name}
        </Text>
        <Flex gap="3">
          <Text>{score.bpm}BPM</Text> - <Text>1/{score.signature}</Text>
        </Flex>
      </Flex>

      <Flex align="center" gap="3">
        <Button
          onClick={() => {
            onLoad();
          }}
        >
          Load
        </Button>
        <Button
          onClick={() => {
            onDelete();
          }}
          color="crimson"
          variant="soft"
        >
          Delete
        </Button>
      </Flex>
    </>
  );
}
