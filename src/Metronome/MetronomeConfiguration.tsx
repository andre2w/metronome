import { Flex, Select, Text, TextField } from "@radix-ui/themes";
import { calculateBeatTime } from "../lib/beat-time";
import type { BaseMetronomeConfigurationProps } from "./configuration";

interface MetronomeConfigurationProps {
  configuration: BaseMetronomeConfigurationProps;
  onChange: (props: BaseMetronomeConfigurationProps) => void;
}
export function MetronomeConfiguration({
  configuration,
  onChange,
}: MetronomeConfigurationProps) {
  const maxGraceTime =
    calculateBeatTime(configuration.beats, configuration.notes) - 2;
  if (configuration.graceTime > maxGraceTime) {
    onChange({ ...configuration, graceTime: maxGraceTime });
  }

  return (
    <Flex gap="5">
      <Flex direction="column">
        <Text>Notes</Text>
        <Select.Root
          value={String(configuration.notes)}
          onValueChange={(value) =>
            onChange({ ...configuration, notes: Number(value) })
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
          value={configuration.beats}
          onChange={(e) =>
            onChange({ ...configuration, beats: Number(e.target.value) })
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
            onChange({
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
