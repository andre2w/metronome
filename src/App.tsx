
import { useState } from 'react'
import { Input } from 'webmidi'
import { Metronome } from './Metronome/Metronome'
import { InputConfiguration } from './InputConfiguration/InputConfiguration';
import { SheetMaker } from './SheetMaker/SheetMaker';
import { defaultMetronomeConfiguration, BaseMetronomeConfigurationProps } from './Metronome/configuration';
import { Flex, Theme, ThemeProps, Select, IconButton } from '@radix-ui/themes';
import { ScoreContextProvider } from './Score/ScoreProvider';
import { MetronomeConfiguration } from './Metronome/MetronomeConfiguration';
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"

const accentColors = ["gray", "gold", "bronze", "brown", "yellow", "amber", "orange", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "lime", "mint", "sky"];

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [configuration, setConfiguration] = useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);
  const [appearance, setAppearance] = useState<"light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState<ThemeProps["accentColor"]>("indigo");

  return (
    <Theme appearance={appearance} accentColor={accentColor}>
      <ScoreContextProvider notes={configuration.notes}>
        <Flex direction="column" style={{ marginLeft: "50px", marginRight: "50px", marginBottom: "10px" }} gap="7">
          <Flex align="end" gap="3">
            <InputConfiguration selectedInput={selectedDevice} onSelect={(input) => setSelectedDevice(input)} />
            <MetronomeConfiguration configuration={configuration} onChange={setConfiguration}  />
            <Flex style={{ flexGrow: "2", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setAppearance(currentAppearance => currentAppearance === "dark" ? "light" : "dark")} >
                  {appearance === "light" ? <SunIcon /> : <MoonIcon />}
              </IconButton>
              <Select.Root onValueChange={value => setAccentColor((value ?? "indigo") as ThemeProps["accentColor"])} value={accentColor}>
                <Select.Trigger />
                <Select.Content>
                  {accentColors.map(color => <Select.Item value={color} >{color}</Select.Item>)}
                </Select.Content>

              </Select.Root>
            </Flex>
          </Flex>
          <Metronome input={selectedDevice} configuration={configuration} />
          <SheetMaker />
        </Flex>
      </ScoreContextProvider>
    </Theme>
  )
}

export default App
