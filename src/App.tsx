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
import { InputConfiguration } from "./InputConfiguration/InputConfiguration";
import { InputConfigurationProvider } from "./InputConfiguration/InputConfigurationContext";
import { Metronome } from "./Metronome";
import { MetronomeConfiguration } from "./Metronome/MetronomeConfiguration";
import {
  type BaseMetronomeConfigurationProps,
  defaultMetronomeConfiguration,
} from "./Metronome/configuration";
import { ScoreContextProvider } from "./Score/ScoreProvider";
import { Sheet } from "./SheetMaker/Sheet";
import { ThemePicker } from "./components/ThemePicker";

function App() {
  const [{ accentColor, appearance }, setThemePreferences] = useLocalStorage(
    "theme-preferences",
    {
      appearance: "dark" as "light" | "dark",
      accentColor: "indigo" as ThemeProps["accentColor"],
    },
  );
  const [configuration, setConfiguration] =
    useState<BaseMetronomeConfigurationProps>(defaultMetronomeConfiguration);

  return (
    <Theme accentColor={accentColor} appearance={appearance}>
      <InputConfigurationProvider>
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
              <InputConfiguration />
              <MetronomeConfiguration
                configuration={configuration}
                onChange={setConfiguration}
              />
              <ThemePicker
                accentColor={accentColor}
                appearance={appearance}
                onChange={setThemePreferences}
              />
            </Flex>
            <Metronome configuration={configuration} />
            <Sheet configuration={configuration} />
          </Flex>
        </ScoreContextProvider>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
