import { Select, TextField } from "@radix-ui/themes";
import { calculateBeatTime } from "../model/beat-time";
import { useScoreStore } from "../../../entities/score/model/state/score-store-provider";
import { useShallow } from "zustand/react/shallow";
import "./metronome-configuration.css";

export function MetronomeConfiguration() {
  const { configuration, onChangeConfiguration } = useScoreStore(
    useShallow(({ configuration, onChangeConfiguration }) => ({
      configuration,
      onChangeConfiguration,
    })),
  );

  const maxGraceTime = calculateBeatTime(configuration.bpm, configuration.signature) - 2;
  if (configuration.graceTime > maxGraceTime) {
    onChangeConfiguration({ ...configuration, graceTime: maxGraceTime });
  }

  return (
    <div className="metronome-config">
      <label className="metronome-config-field">
        <span className="metronome-config-label">Name</span>
        <TextField.Root
          size="1"
          type="text"
          value={configuration.name}
          onChange={(e) =>
            onChangeConfiguration({
              ...configuration,
              name: e.target.value,
            })
          }
        />
      </label>
      <label className="metronome-config-field">
        <span className="metronome-config-label">Signature</span>
        <Select.Root
          size="1"
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
      </label>
      <label className="metronome-config-field">
        <span className="metronome-config-label">BPM</span>
        <TextField.Root
          size="1"
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
      </label>
      <label className="metronome-config-field">
        <span className="metronome-config-label">Grace (ms)</span>
        <TextField.Root
          size="1"
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
      </label>
    </div>
  );
}
