import { Modifier } from "./modifier";

export interface Key {
  note: string;
  modifier?: string;
}
/**
 * This is all the information that a Key should have to be rendered in the UI
 */
export interface KeyData {
  value: string;
  label: string;
  modifiers?: Record<string, { label: string; modifier: Modifier }>;
}
