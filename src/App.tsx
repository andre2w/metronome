import { Flex, Theme, type ThemeProps } from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import "./App.css";
import { InputConfiguration } from "./components/InputConfiguration/InputConfiguration";
import { InputConfigurationProvider } from "./components/InputConfiguration/InputConfigurationContext";
import { Metronome } from "./components/metronome/metronome";
import { Sheet } from "./SheetMaker/Sheet";
import { ThemePicker } from "./components/ThemePicker";
import { useRef } from "react";
import { VexflowScore, type VexflowScoreHandle } from "./Score/VexflowScore";

function App() {
  const vexflowScoreRef = useRef<VexflowScoreHandle>(null);
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
              <Metronome
                onTick={(index) => {
                  vexflowScoreRef.current?.setCursor(index);
                }}
              />
              <VexflowScore ref={vexflowScoreRef} />
              <Sheet />
            </Flex>
          </div>
        </div>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
