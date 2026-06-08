/**
 * Maps the values emitted by a midi input to the existing notes
 */
export type MidiInputMappings = Record<number, { note: string; modifier?: string }>;
