
import { useRef, useState } from 'react'
import { Input } from 'webmidi'
import { Metronome } from './Metronome/Metronome'
import { InputConfiguration } from './InputConfiguration/InputConfiguration';
import { SheetMaker } from './SheetMaker/SheetMaker';
import { defaultMetronomeConfiguration, BaseMetronomeConfigurationProps } from './Metronome/configuration';
import { Score } from './lib/types';
import { useVexflow } from './hooks/useVexflow';

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [configuration, setConfiguration] = useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);
  const [score, setScore] = useState<Score>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { draw } = useVexflow();

  return (
    <main className='container'>
      <div style={{ backgroundColor: "wheat" }} ref={canvasRef}></div>
      <button onClick={() => draw(score, canvasRef.current)}></button>
      <InputConfiguration selectedInput={selectedDevice} onSelect={(input) => setSelectedDevice(input)} />
      <Metronome input={selectedDevice} configuration={configuration} onChangeConfiguration={setConfiguration} score={score} />
      <SheetMaker notes={configuration.notes} score={score} setScore={setScore} />
    </main>
  )
}

export default App
