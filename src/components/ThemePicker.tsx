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
];

export interface ThemePickerProps {
  appearance: "light" | "dark";
  accentColor: ThemeProps["accentColor"];
  onChange: ({
    accentColor,
    appearance,
  }: Pick<ThemePickerProps, "appearance" | "accentColor">) => void;
}

export function ThemePicker({
  appearance,
  accentColor,
  onChange,
}: ThemePickerProps) {
  return (
    <Flex flexGrow="1" justify="end" gap="1">
      <IconButton
        onClick={() =>
          onChange({
            appearance: appearance === "dark" ? "light" : "dark",
            accentColor,
          })
        }
      >
        {appearance === "light" ? <SunIcon /> : <MoonIcon />}
      </IconButton>
      <Select.Root
        onValueChange={(value) =>
          onChange({
            appearance,
            accentColor: (value ?? "indigo") as ThemeProps["accentColor"],
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
    </Flex>
  );
}
