import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { type Input, WebMidi } from "webmidi";
import { NO_INPUT_SELECTED } from "../config/constants";
import { useSelectedDevice } from "../model/use-selected-device";

export const InputConfigurationContext = createContext<{
  selectedDevice?: Input;
  selectDevice: (id: string) => void;
  devices: Input[];
  enabled: boolean;
  enable: () => Promise<void>;
}>({
  selectDevice: () => {
    //
  },
  devices: [],
  enabled: false,
  enable: async () => {
    //
  },
});
export type WebMidiApi = Awaited<ReturnType<typeof createWebMidi>>;

export function InputConfigurationProvider({ children }: { children: ReactNode }) {
  const {
    selectDevice: setSelectedDevice,
    enable,
    state: { device: selectedDevice, deviceList, webMidiEnabled },
  } = useSelectedDevice();
  const [webmidi, setWebMidi] = useState<WebMidiApi | undefined>(undefined);

  const enableWebMidi = async () => {
    if (webmidi) {
      return;
    }
    const webMidiInstance = await createWebMidi();
    setWebMidi(webMidiInstance);

    enable(webMidiInstance.inputs ?? []);
  };

  useEffect(() => {
    enableWebMidi();
  }, []);

  const selectDevice = useCallback(
    (id: string) => {
      if (id === NO_INPUT_SELECTED) {
        setSelectedDevice(null);
        return;
      }
      if (!webmidi) {
        return;
      }
      const device = webmidi?.getInputById(id);
      setSelectedDevice(device);
    },
    [webmidi],
  );

  return (
    <InputConfigurationContext.Provider
      value={{
        selectedDevice: selectedDevice === null ? undefined : selectedDevice,
        selectDevice,
        devices: deviceList,
        enabled: webMidiEnabled,
        enable: enableWebMidi,
      }}
    >
      {children}
    </InputConfigurationContext.Provider>
  );
}

function createWebMidi() {
  return WebMidi.enable();
}

export function useInputConfigurationContext() {
  return useContext(InputConfigurationContext);
}
