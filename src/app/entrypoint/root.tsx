import { Theme, ThemeProps } from "@radix-ui/themes";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLocalStorage } from "usehooks-ts";
import { InputConfiguration } from "~/entities/midi-input/ui/input-configuration";
import { InputConfigurationProvider } from "~/entities/midi-input/ui/input-configuration-context";
import { ThemePicker } from "./theme-picker";
import "./styles.scss";
import styles from "./root.module.scss";
import { ConfigurationContextProvider } from "~/shared/lib/configuration/configuration-provider";
import { mappings } from "~/entities/midi-input/config/mappings/roland-td07";
import { KEYS } from "~/shared/lib/configuration/notes";
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
            <div className={styles["app-shell"]}>
              <header className={styles.navbar}>
                <div className={styles["navbar-brand"]}>
                  <span className={styles["navbar-wordmark"]}>metronome</span>
                  <span className={styles["navbar-tagline"]}>/ DRUM PRACTICE CONSOLE</span>
                </div>
                <div className={styles["navbar-section"]}>
                  <InputConfiguration />
                  <ThemePicker
                    appearance={appearance}
                    accentColor={accentColor}
                    onChange={setThemePreferences}
                  />
                </div>
              </header>
              <main className={styles.page}>
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
