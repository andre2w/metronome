import {
  Flex,  
  Theme,
  type ThemeProps,
} from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import { InputConfiguration } from "./InputConfiguration/InputConfiguration";
import { InputConfigurationProvider } from "./InputConfiguration/InputConfigurationContext";
import { Metronome } from "./Metronome";
import { MetronomeConfiguration } from "./Metronome/MetronomeConfiguration";
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

  return (
    <Theme accentColor={accentColor} appearance={appearance}>
      <InputConfigurationProvider>
        <ScoreContextProvider>
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
              <MetronomeConfiguration />
              <ThemePicker
                accentColor={accentColor}
                appearance={appearance}
                onChange={setThemePreferences}
              />
            </Flex>
            <Metronome />
            <Sheet />
          </Flex>
        </ScoreContextProvider>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
