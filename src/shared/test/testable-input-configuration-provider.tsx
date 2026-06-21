import { ReactNode } from "react";
import { InputConfigurationContext } from "~/entities/midi-input/ui/input-configuration-context";

export interface TestableInputConfigurationProviderProps {
  children: ReactNode;
}

export function TestableInputConfigurationProvider({
  children,
}: TestableInputConfigurationProviderProps) {
  return (
    <InputConfigurationContext.Provider
      value={{ devices: [], enable: async () => {}, enabled: true, selectDevice: () => {} }}
    >
      {children}
    </InputConfigurationContext.Provider>
  );
}
