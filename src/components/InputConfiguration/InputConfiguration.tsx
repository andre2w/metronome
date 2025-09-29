import { Button, Select } from "@radix-ui/themes";
import {
  NO_INPUT_SELECTED,
  useInputConfigurationContext,
} from "./InputConfigurationContext";

export function InputConfiguration() {
  const { devices, enable, enabled, selectDevice, selectedDevice } =
    useInputConfigurationContext();

  if (!enabled) {
    return (
      <div>
        <Button onClick={() => enable()}>
          Enable WebMidi to start using the app
        </Button>
      </div>
    );
  }

  return (
    <Select.Root
      onValueChange={selectDevice}
      value={selectedDevice?.id ?? NO_INPUT_SELECTED}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value={NO_INPUT_SELECTED}>Select a device</Select.Item>
        {devices.map((device) => (
          <Select.Item value={device.id} key={device.id}>
            {device.manufacturer} {device.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
