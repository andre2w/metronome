import { TextField } from "@radix-ui/themes";
import { calculateBeatTime } from "../../../shared/lib/metronome/beat-time";
import { useScoreStore } from "../../../entities/score/model/state/score-store-provider";
import { useShallow } from "zustand/react/shallow";
import "./metronome-configuration.css";
import { useEffect } from "react";

export function MetronomeConfiguration() {
  const { metronome, setMetronomeConfig, score, updateMetadata } = useScoreStore(
    useShallow(({ metronome, setMetronomeConfig, score, updateMetadata }) => ({
      metronome,
      setMetronomeConfig,
      score,
      updateMetadata,
    })),
  );

  useEffect(() => {
    const maxGraceTime = calculateBeatTime(metronome.bpm, 16) - 2;
    if (metronome.graceTime > maxGraceTime) {
      setMetronomeConfig({ graceTime: maxGraceTime });
    }
  }, [metronome]);

  return (
    <div className="metronome-config">
      <label className="metronome-config-field">
        <span className="metronome-config-label">Name</span>
        <TextField.Root
          size="1"
          type="text"
          value={score.name}
          onChange={(e) => updateMetadata({ name: e.target.value })}
        />
      </label>
      {/*<label className="metronome-config-field">*/}
      {/*<span className="metronome-config-label">Signature</span>*/}
      {/*<Select.Root
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
        </Select.Root>*/}
      {/*</label>*/}
      <label className="metronome-config-field">
        <span className="metronome-config-label">BPM</span>
        <TextField.Root
          size="1"
          type="number"
          value={metronome.bpm}
          onChange={(e) =>
            setMetronomeConfig({
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
          value={metronome.graceTime}
          onChange={(e) =>
            setMetronomeConfig({
              graceTime: e.target.value ? Number(e.target.value) : 0,
            })
          }
          step={100}
        />
      </label>
    </div>
  );
}
