export interface MetronomeCursor {
  bar: number;
  part: number;
  note: number;
}

export function isCursorEquals(left: MetronomeCursor, right: MetronomeCursor) {
  return left.bar === right.bar && left.part === right.part && left.note === right.note;
}
