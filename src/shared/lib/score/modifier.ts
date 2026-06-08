export interface Parenthesis {
  type: "parenthesis";
  which: "left" | "right" | "both";
}

export interface Annotation {
  type: "annotation";
  value: string;
}

export interface ValueOverride {
  type: "value-override";
  value: string;
}

/**
 * Modifiers change how a key should be rendered, it also means a different
 * to play that same key, like Accented or Ghosted.
 */
export type Modifier = Parenthesis | Annotation | ValueOverride;
