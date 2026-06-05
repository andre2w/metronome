import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Select, type ThemeProps } from "@radix-ui/themes";

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
] as const satisfies readonly ThemeProps["accentColor"][];

export interface ThemePickerProps {
  appearance: "light" | "dark";
  accentColor: ThemeProps["accentColor"];
  onChange: (preferences: {
    appearance: "light" | "dark";
    accentColor: ThemeProps["accentColor"];
  }) => void;
}

export function ThemePicker({ appearance, accentColor, onChange }: ThemePickerProps) {
  return (
    <Flex align="center" gap="2">
      <Select.Root
        onValueChange={(value) =>
          onChange({
            appearance,
            accentColor: (value ?? "yellow") as ThemeProps["accentColor"],
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
      <IconButton
        variant="surface"
        onClick={() =>
          onChange({
            accentColor,
            appearance: appearance === "dark" ? "light" : "dark",
          })
        }
        aria-label={`Switch to ${appearance === "dark" ? "light" : "dark"} mode`}
      >
        {appearance === "light" ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Flex>
  );
}
