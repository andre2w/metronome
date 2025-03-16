import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Flex,
  IconButton,
  Select,
  Theme,
  type ThemeProps,
} from "@radix-ui/themes";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { Input } from "webmidi";
import { InputConfiguration } from "./InputConfiguration/InputConfiguration";
import { Metronome } from "./Metronome/Metronome";
import { MetronomeConfiguration } from "./Metronome/MetronomeConfiguration";
import {
  type BaseMetronomeConfigurationProps,
  defaultMetronomeConfiguration,
} from "./Metronome/configuration";
import { ScoreContextProvider } from "./Score/ScoreProvider";
import { Sheet } from "./SheetMaker/Sheet";

const accentColors = [
  "gray",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
];

function App() {
  const [{ accentColor, appearance }, setThemePreferences] = useLocalStorage(
    "theme-preferences",
    {
      appearance: "dark" as "light" | "dark",
      accentColor: "indigo" as ThemeProps["accentColor"],
    },
  );
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [configuration, setConfiguration] =
    useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);

  return (
    <Theme appearance={appearance} accentColor={accentColor}>
      <ScoreContextProvider notes={configuration.notes}>
        <Flex
          direction="column"
          style={{
            marginLeft: "50px",
            marginRight: "50px",
            marginBottom: "10px",
          }}
          gap="7"
        >
          <Flex align="end" gap="3">
            <InputConfiguration
              selectedInput={selectedDevice}
              onSelect={(input) => setSelectedDevice(input)}
            />
            <MetronomeConfiguration
              configuration={configuration}
              onChange={setConfiguration}
            />
            <Flex
              style={{ flexGrow: "2", justifyContent: "flex-end", gap: "5px" }}
            >
              <IconButton
                onClick={() =>
                  setThemePreferences({
                    appearance: appearance === "dark" ? "light" : "dark",
                    accentColor,
                  })
                }
              >
                {appearance === "light" ? <SunIcon /> : <MoonIcon />}
              </IconButton>
              <Select.Root
                onValueChange={(value) =>
                  setThemePreferences({
                    appearance,
                    accentColor: (value ??
                      "indigo") as ThemeProps["accentColor"],
                  })
                }
                value={accentColor}
              >
                <Select.Trigger />
                <Select.Content>
                  {accentColors.map((color) => (
                    <Select.Item key={color} value={color}>
                      {color}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
          <Metronome input={selectedDevice} configuration={configuration} />
          <Sheet configuration={configuration} />
        </Flex>
      </ScoreContextProvider>
    </Theme>
  );
}

export default App;
