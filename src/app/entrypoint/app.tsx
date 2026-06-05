import { Theme, type ThemeProps } from "@radix-ui/themes";
import { useLocalStorage } from "usehooks-ts";
import "./styles.css";
import "./app.css";
import { InputConfigurationProvider } from "../../entities/midi-input/ui/input-configuration-context";
import { InputConfiguration } from "../../entities/midi-input/ui/input-configuration";
import { ThemePicker } from "./theme-picker";
import { Metronome } from "~/pages/metronome";

function App() {
  const [{ appearance, accentColor }, setThemePreferences] = useLocalStorage("theme-preferences", {
    appearance: "dark" as "light" | "dark",
    accentColor: "yellow" as ThemeProps["accentColor"],
  });
  return (
    <Theme
      accentColor={accentColor}
      grayColor="sand"
      panelBackground="solid"
      radius="none"
      scaling="100%"
      appearance={appearance}
    >
      <InputConfigurationProvider>
        <div className="app-shell">
          <header className="navbar">
            <div className="navbar-brand">
              <span className="navbar-wordmark">metronome</span>
              <span className="navbar-tagline">/ DRUM PRACTICE CONSOLE</span>
            </div>
            <div className="navbar-section">
              <InputConfiguration />
              <ThemePicker
                appearance={appearance}
                accentColor={accentColor}
                onChange={setThemePreferences}
              />
            </div>
          </header>
          <main className="page">
            <Metronome />
          </main>
        </div>
      </InputConfigurationProvider>
    </Theme>
  );
}

export default App;
