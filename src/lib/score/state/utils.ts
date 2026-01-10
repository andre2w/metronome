import type { NotesWithSticking } from "../types";

export function createStave(notes: number) {
  return Array.from<NotesWithSticking>({ length: notes }).fill({
    notes: [],
  });
}
