import { Key } from "./key-data";

/**
 * Is the capture of a note played through the midi interface
 */
export interface NotePlayed {
  /**
   * timestamp of when the note was played
   */
  timestamp: number;
  /**
   * note is the note number
   */
  note: Key;
}
