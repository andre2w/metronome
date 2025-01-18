import { Input } from "webmidi";
import { useWebMidi } from "../hooks/useWebMidi";
import { ChangeEventHandler } from "react";
import classes from "./InputConfiguration.module.scss";

export const NO_INPUT_SELECTED = "NO_INPUT_SELECTED";

export interface InputConfigurationProps {
  selectedInput?: Input;
  onSelect: (input: Input | undefined) => void;
}

export function InputConfiguration({ selectedInput, onSelect }: InputConfigurationProps) {
  const { enable, webmidi } = useWebMidi();

  if (!webmidi) {
    return <div className={classes.enableMidi}>
      <button onClick={() => enable()}>Enable WebMidi to start using the app</button>
      </div>;
  }

  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => { 
    const value = e.target.value;

    if (value === NO_INPUT_SELECTED) {
      onSelect(undefined);
      return;
    }

    const input = webmidi.getInputById(e.target.value);
    onSelect(input);
  }

  return <div className="grid">
    <div>
      Device:
      <select onChange={onChange} value={selectedInput?.id ?? NO_INPUT_SELECTED}>
        <option value={NO_INPUT_SELECTED}>Select a device</option>
        {webmidi.inputs.map(input => <option value={input.id} key={input.id}>{input.manufacturer} {input.name}</option>)}
      </select>
    </div>
  </div>
}