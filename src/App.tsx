
import { useState } from 'react'
import { Input } from 'webmidi'
import { Metronome } from './Metronome/Metronome'
import { InputConfiguration } from './InputConfiguration/InputConfiguration';
import { SheetMaker } from './SheetMaker/SheetMaker';
import { defaultMetronomeConfiguration, BaseMetronomeConfigurationProps } from './Metronome/configuration';
import { Theme } from '@radix-ui/themes';
import { ScoreContextProvider } from './Score/ScoreProvider';

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [configuration, setConfiguration] = useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);

  return (
    <Theme appearance="inherit" accentColor="indigo">
      <ScoreContextProvider notes={configuration.notes}>
        <div style={{ marginLeft: "50px", marginRight: "50px", marginBottom: "10px", display: "flex", flexDirection: "column" }}>
          <InputConfiguration selectedInput={selectedDevice} onSelect={(input) => setSelectedDevice(input)} />
          <Metronome input={selectedDevice} configuration={configuration} onChangeConfiguration={setConfiguration} />
          <SheetMaker />
        </div>
      </ScoreContextProvider>
    </Theme>
  )
}

export default App
