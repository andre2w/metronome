export function calculateBeatTime(beats: number, notes: number) {
  return Math.round(((60.0 / beats) * 1000) / (notes / 4));
}

export function calculateBeatTimeTriplet(beats: number, notes: number) {
  return Math.round(((60.0 / beats) * 1000) / (notes / 3));
}
