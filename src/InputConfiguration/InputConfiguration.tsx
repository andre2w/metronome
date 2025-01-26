import { Input } from "webmidi";
import { useWebMidi } from "../hooks/useWebMidi";
import classes from "./InputConfiguration.module.scss";
import { Button, Select } from "@radix-ui/themes";

export const NO_INPUT_SELECTED = "NO_INPUT_SELECTED";

export interface InputConfigurationProps {
  selectedInput?: Input;
  onSelect: (input: Input | undefined) => void;
}

export function InputConfiguration({ selectedInput, onSelect }: InputConfigurationProps) {
  const { enable, webmidi } = useWebMidi();

  if (!webmidi) {
    return <div className={classes.enableMidi}>
      <Button onClick={() => enable()}>Enable WebMidi to start using the app</Button>
      </div>;
  }

  const onChange = (value: string) => { 
    if (value === NO_INPUT_SELECTED) {
      onSelect(undefined);
      return;
    }

    const input = webmidi.getInputById(value);
    onSelect(input);
  }

  return <Select.Root onValueChange={onChange} value={selectedInput?.id ?? NO_INPUT_SELECTED}>
    <Select.Trigger />
    <Select.Content>
      <Select.Item value={NO_INPUT_SELECTED}>Select a device</Select.Item>
      {webmidi.inputs.map(input => <Select.Item value={input.id} key={input.id}>{input.manufacturer} {input.name}</Select.Item>)}
    </Select.Content>
  </Select.Root>
}