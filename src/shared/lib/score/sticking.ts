export const sticking = ["L", "R", "R/L"] as const;

export type Sticking = (typeof sticking)[number];
