import { Flex, Theme, type ThemeProps } from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import "./App.css";
import { InputConfiguration } from "./components/InputConfiguration/InputConfiguration";
import { InputConfigurationProvider } from "./components/InputConfiguration/InputConfigurationContext";
import { Metronome } from "./Metronome";
import { MetronomeConfiguration } from "./Metronome/MetronomeConfiguration";
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
        <div className="container">
          <Flex className="navbar" justify="between" align="center">
            <InputConfiguration />
            <ThemePicker
              accentColor={accentColor}
              appearance={appearance}
              onChange={setThemePreferences}
            />
          </Flex>
          <div className="grid-main">
            <Flex
              direction="column"
              style={{
                marginLeft: "50px",
                marginRight: "50px",
                marginBottom: "10px",
              }}
              gap="7"
            >
              <Metronome />
              <MetronomeConfiguration />
              <Sheet />
            </Flex>
          </div>
        </div>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
