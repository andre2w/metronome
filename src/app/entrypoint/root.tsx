import { Theme, ThemeProps } from "@radix-ui/themes";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLocalStorage } from "usehooks-ts";
import { InputConfiguration } from "~/entities/midi-input/ui/input-configuration";
import { InputConfigurationProvider } from "~/entities/midi-input/ui/input-configuration-context";
import { ThemePicker } from "./theme-picker";
import "./styles.css";
import "./root.css";
import { ConfigurationContextProvider } from "~/shared/lib/configuration/configuration-provider";
import { mappings } from "~/entities/midi-input/config/mappings/roland-td07";
import { KEYS } from "~/entities/score/model/notes";
import { ScoreProvider } from "~/entities/score/model/state/score-store-provider";

function RootLayout() {
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
      <ConfigurationContextProvider keyMap={KEYS} mappings={mappings}>
        <InputConfigurationProvider>
          <ScoreProvider>
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
                <Outlet />
              </main>
            </div>
            <TanStackRouterDevtools />
          </ScoreProvider>
        </InputConfigurationProvider>
      </ConfigurationContextProvider>
    </Theme>
  );
}

export const Route = createRootRoute({ component: RootLayout });
