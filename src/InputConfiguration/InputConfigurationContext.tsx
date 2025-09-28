import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { type Input, WebMidi } from "webmidi";

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

export const NO_INPUT_SELECTED = "NO_INPUT_SELECTED";

export function InputConfigurationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [storedSelection, setStoredSelection] = useLocalStorage<
    undefined | string
  >("SELECTED_DEVICE_ID", undefined);
  const [selectedDevice, setSelectedDevice] = useState<Input | undefined>();
  const [webmidi, setWebMidi] = useState<WebMidiApi | undefined>(undefined);

  const enable = async () => {
    if (webmidi) {
      return;
    }
    const webMidiInstance = await createWebMidi();
    setWebMidi(webMidiInstance);
    if (storedSelection) {
      const device = webMidiInstance.getInputById(storedSelection);
      setSelectedDevice(device);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Ask to enable once
  useEffect(() => {
    enable();
  }, []);

  const selectDevice = useCallback(
    (id: string) => {
      if (id === NO_INPUT_SELECTED) {
        setSelectedDevice(undefined);
        setStoredSelection(undefined);
        return;
      }
      if (!webmidi) {
        return;
      }
      const device = webmidi?.getInputById(id);
      setSelectedDevice(device);
      setStoredSelection(id);
    },
    [webmidi, setStoredSelection],
  );

  return (
    <InputConfigurationContext.Provider
      value={{
        selectedDevice,
        selectDevice,
        devices: webmidi?.inputs ?? [],
        enabled: !!webmidi,
        enable,
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
