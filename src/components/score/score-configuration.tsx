import { Flex, Select, Text, TextField } from "@radix-ui/themes";
import { useScoreStore } from "../../lib/score/state";

export function ScoreConfiguration() {
  const configuration = useScoreStore((state) => state.configuration);
  const onChangeConfiguration = useScoreStore(
    (state) => state.onChangeConfiguration,
  );

  return (
    <Flex gap="5">
      <Flex direction="column">
        <Text>Name</Text>
        <TextField.Root
          type="text"
          value={configuration.name}
          onChange={(e) =>
            onChangeConfiguration({
              ...configuration,
              name: e.target.value,
            })
          }
        />
      </Flex>
      <Flex direction="column">
        <Text>Notes</Text>
        <Select.Root
          value={String(configuration.signature)}
          onValueChange={(value) => {
            const newSignature = Number(value);
            if (
              newSignature === 4 ||
              newSignature === 8 ||
              newSignature === 16
            ) {
              onChangeConfiguration({
                ...configuration,
                signature: newSignature,
              });
            }
          }}
          defaultValue="4"
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="4">1/4</Select.Item>
            <Select.Item value="8">1/8</Select.Item>
            <Select.Item value="16">1/16</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Flex direction="column">
        <Text>BPM</Text>
        <TextField.Root
          type="number"
          value={configuration.bpm}
          onChange={(e) =>
            onChangeConfiguration({
              ...configuration,
              bpm: Number(e.target.value),
            })
          }
          step={5}
        />
      </Flex>
    </Flex>
  );
}
