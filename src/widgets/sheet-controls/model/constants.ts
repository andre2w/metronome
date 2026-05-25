import { Note } from "~/entities/score/model/types";

export const noteLabel: Record<Note, string> = {
  KICK: "Kick",
  SNARE: "Snare",
  SNARE_X_STICK: "Snare cross-stick",
  GHOST_SNARE: "Snare (Ghosted)",
  ACCENTED_SNARE: "Snare (Accented)",
  TOM_1: "Tom 1",
  TOM_2: "Tom 2",
  TOM_3: "Tom 3",
  HIGH_HAT: "High hat",
  HIGH_HAT_OPEN: "High hat open",
  HIGH_HAT_PEDAL: "High hat pedal",
  CRASH: "Crash",
  RIDE: "Ride",
};

export const counting: { [k: number]: string[] } = {
  4: ["1", "2", "3", "4"],
  8: ["1", "&", "2", "&", "3", "&", "4", "&"],
  16: ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"],
};
