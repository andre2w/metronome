import { Flex, Select, Text, TextField } from "@radix-ui/themes";
import { useMetronomeStore } from "../../lib/metronome-store";
import { useShallow } from "zustand/shallow";

export function MetronomeConfiguration() {
  const { onUpdate, signature, bpm, graceTime } = useMetronomeStore(
    useShallow((state) => ({
      onUpdate: state.onUpdate,
      signature: state.signature,
      bpm: state.bpm,
      graceTime: state.graceTime,
    })),
  );

  return (
    <Flex gap="5">
      <Flex direction="column">
        <Text>Notes</Text>
        <Select.Root
          value={String(signature)}
          onValueChange={(value) => {
            const newSignature = Number(value);
            if (
              newSignature === 4 ||
              newSignature === 8 ||
              newSignature === 16
            ) {
              onUpdate({ signature: newSignature });
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
          value={bpm}
          onChange={(e) =>
            onUpdate({
              bpm: Number(e.target.value),
            })
          }
          step={5}
        />
      </Flex>
      <Flex direction="column">
        <Text>Grace time</Text>
        <TextField.Root
          type="number"
          value={graceTime}
          onChange={(e) =>
            onUpdate({
              graceTime: e.target.value ? Number(e.target.value) : 0,
            })
          }
          step={100}
        />
      </Flex>
    </Flex>
  );
}
