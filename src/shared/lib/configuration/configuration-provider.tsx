import { createContext, ReactNode, useContext, useState } from "react";
import { Key, KeyData } from "../score/key-data";
import { MidiInputMappings } from "../score/mapping";

export class Configuration {
  constructor(
    private readonly keyMap: Record<string, KeyData>,
    private readonly mappings: MidiInputMappings,
  ) {}
  /**
   * List all the keys that are available for rendering
   */
  keys() {
    return Object.entries(this.keyMap).map(([key, data]) => ({ key, ...data }));
  }

  getKeyData(key: string) {
    console.log("KeyMap", this.keyMap);
    return this.keyMap[key];
  }

  getKeyValue(key: Key) {
    console.log("Key", key);
    const baseValue = this.getKeyData(key.note);
    if (!baseValue) {
      throw new Error(`Could not find value for note ${key.note}`);
    }
    if (key.modifier && baseValue.modifiers) {
      const modifier = baseValue.modifiers[key.modifier];
      if (modifier && modifier.modifier.type === "value-override") {
        return modifier.modifier.value;
      }
    }

    return baseValue.value;
  }

  getKeyFromMidiInput(midiNote: number) {
    return this.mappings[midiNote];
  }
}

export const ConfigurationContext = createContext<Configuration>(new Configuration({}, {}));

export interface ConfigurationContextProviderProps {
  keyMap: Record<string, KeyData>;
  mappings: MidiInputMappings;
  children: ReactNode;
}

export function ConfigurationContextProvider({
  children,
  keyMap,
  mappings,
}: ConfigurationContextProviderProps) {
  const [configuration] = useState(() => new Configuration(keyMap, mappings));

  return (
    <ConfigurationContext.Provider value={configuration}>{children}</ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  return useContext(ConfigurationContext);
}
