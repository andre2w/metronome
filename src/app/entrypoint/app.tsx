import { Flex, Theme, type ThemeProps } from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import "./app.css";
import { InputConfigurationProvider } from "../../entities/midi-input/ui/input-configuration-context";
import { InputConfiguration } from "../../entities/midi-input/ui/input-configuration";
import { ThemePicker } from "./theme-picker";
import { Metronome } from "~/pages/metronome";

function App() {
  const [{ accentColor, appearance }, setThemePreferences] = useLocalStorage("theme-preferences", {
    appearance: "dark" as "light" | "dark",
    accentColor: "indigo" as ThemeProps["accentColor"],
  });
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
            <Metronome />
          </div>
        </div>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
