import { calculateBeatTime } from "../lib/beat-time";
import { BaseMetronomeConfigurationProps } from "./configuration";

interface MetronomeConfigurationProps {
  configuration: BaseMetronomeConfigurationProps;
  started: boolean;
  onChange: (props: BaseMetronomeConfigurationProps) => void;
  toggle: () => void;
}
export function MetronomeConfiguration({ configuration, started, onChange, toggle }: MetronomeConfigurationProps) {
  const maxGraceTime = calculateBeatTime(configuration.beats, configuration.notes) - 2;
  if (configuration.graceTime > maxGraceTime) {
    onChange({ ...configuration, graceTime: maxGraceTime });
  }

  return <div className="grid">
    <label>
      Notes:
      <select value={configuration.notes} onChange={e => onChange({ ...configuration, notes: Number(e.target.value) })}>
        <option value="4">1/4</option>
        <option value="8">1/8</option>
        <option value="16">1/16</option>
      </select>
    </label>
    <label>
      BPM:
      <input type="number" value={configuration.beats} onChange={e => onChange({ ...configuration, beats: Number(e.target.value) })} step={1} />
    </label>
    <label style={{ alignSelf: "end" }}>
      <button style={{ marginBottom: "21px" }} onClick={() => toggle()}>{started ? "Stop" : "Start" }</button>
    </label>
    <label>
      Grace time:
      <input type="number" value={configuration.graceTime} onChange={e => onChange({ ...configuration, graceTime: e.target.value ? Number(e.target.value) : 0 })} step={100} />
    </label>
  </div>
}