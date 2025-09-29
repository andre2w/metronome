import { Flex, Select, Text, TextField } from "@radix-ui/themes";
import { calculateBeatTime } from "../lib/beat-time";
import { useScoreStore } from "../lib/zustand-store";

export function MetronomeConfiguration() {
  const configuration = useScoreStore((state) => state.configuration);
  console.log("Configuration", configuration);
  const onChangeConfiguration = useScoreStore(
    (state) => state.onChangeConfiguration,
  );

  const maxGraceTime =
    calculateBeatTime(configuration.bpm, configuration.signature) - 2;
  if (configuration.graceTime > maxGraceTime) {
    onChangeConfiguration({ ...configuration, graceTime: maxGraceTime });
  }

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
          onValueChange={(value) =>
            onChangeConfiguration({
              ...configuration,
              signature: Number(value),
            })
          }
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
          step={1}
        />
      </Flex>
      <Flex direction="column">
        <Text>Grace time</Text>
        <TextField.Root
          type="number"
          value={configuration.graceTime}
          onChange={(e) =>
            onChangeConfiguration({
              ...configuration,
              graceTime: e.target.value ? Number(e.target.value) : 0,
            })
          }
          step={100}
        />
      </Flex>
    </Flex>
  );
}
