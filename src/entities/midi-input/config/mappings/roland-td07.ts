import { BaseKeys } from "~/entities/score/model/notes";

export const mappings: Record<number, { note: BaseKeys; modifier?: string }> = {
  36: { note: "KICK" },
  38: { note: "SNARE" },
  40: { note: "SNARE" }, // SNARE RIM
  37: { note: "SNARE", modifier: "SNARE_X_STICK" },
  48: { note: "TOM_1" },
  45: { note: "TOM_2" },
  43: { note: "TOM_3" },
  46: { note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" },
  26: { note: "HIGH_HAT", modifier: "HIGH_HAT_OPEN" },
  42: { note: "HIGH_HAT" },
  22: { note: "HIGH_HAT" },
  44: { note: "HIGH_HAT_PEDAL" },
  49: { note: "CRASH" }, // 1
  55: { note: "CRASH" }, // 1
  57: { note: "CRASH" }, // 2
  52: { note: "CRASH" }, // 2
  51: { note: "RIDE" },
  59: { note: "RIDE" },
  53: { note: "RIDE" },
};
