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

export type Modifier = Parenthesis | Annotation | ValueOverride;
