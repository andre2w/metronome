import { Flex, Theme, type ThemeProps } from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import "./App.css";
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
          <div className="container">                        
            <div className="header-left"><InputConfiguration /></div>            
            <div className="header-right"><ThemePicker
                accentColor={accentColor}
                appearance={appearance}
                onChange={setThemePreferences}
              /></div>
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
          
        </ScoreContextProvider>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
