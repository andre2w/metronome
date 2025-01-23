
import { useState } from 'react'
import { Input } from 'webmidi'
import { Metronome } from './Metronome/Metronome'
import { InputConfiguration } from './InputConfiguration/InputConfiguration';
import { SheetMaker } from './SheetMaker/SheetMaker';
import { defaultMetronomeConfiguration, BaseMetronomeConfigurationProps } from './Metronome/configuration';
import { Score } from './lib/types';
import { VexflowScore } from './VexflowScore/VexflowScore';
import { Theme } from '@radix-ui/themes';

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [configuration, setConfiguration] = useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);
  const [score, setScore] = useState<Score>([]);

  return (
    <Theme appearance="dark" accentColor="indigo">
      <div style={{ marginLeft: "50px", marginRight: "50px", marginBottom: "10px", display: "flex", flexDirection: "column" }}>
        <InputConfiguration selectedInput={selectedDevice} onSelect={(input) => setSelectedDevice(input)} />
        <Metronome input={selectedDevice} configuration={configuration} onChangeConfiguration={setConfiguration} score={score} />
        {score.length ? <VexflowScore score={score}/> : null}
        <SheetMaker notes={configuration.notes} score={score} setScore={setScore} />
      </div>
    </Theme>
  )
}

export default App
