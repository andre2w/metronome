import { Button, Flex, Text } from "@radix-ui/themes";

export interface DeleteScoreProps {
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteScore({ onDelete, onCancel }: DeleteScoreProps) {
  return (
    <>
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
            onCancel();
          }}
          variant="soft"
        >
          No
        </Button>
      </Flex>
    </>
  );
}
