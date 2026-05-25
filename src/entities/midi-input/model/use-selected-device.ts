import { useReducer } from "react";
import { LOCAL_STORAGE_KEY } from "../config/constants";
import { type Input } from "webmidi";

export type Actions =
  | { type: "select_device"; device: Input | null }
  | { type: "enable_webmidi"; deviceList: Input[] };

export interface DeviceSelectionState {
  device: Input | null;
  deviceList: Input[];
  webMidiEnabled: boolean;
}

function selectedDeviceReducer(state: DeviceSelectionState, action: Actions): DeviceSelectionState {
  if (action.type === "select_device") {
    if (action.device === null) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, action.device.name);
    }

    return {
      ...state,
      device: action.device,
    };
  }

  if (action.type === "enable_webmidi") {
    const previousDevice = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const device = action.deviceList.find((device) => device.name === previousDevice) ?? null;
    return {
      device: device,
      deviceList: action.deviceList,
      webMidiEnabled: true,
    };
  }

  throw new Error("Action not implemented");
}

export function useSelectedDevice() {
  const [state, dispatch] = useReducer(selectedDeviceReducer, {
    device: null,
    deviceList: [],
    webMidiEnabled: false,
  });

  return {
    selectDevice: (device: Input | null) => dispatch({ type: "select_device", device }),
    enable: (deviceList: Input[]) => dispatch({ type: "enable_webmidi", deviceList }),
    state,
  };
}
