export function nextInLoop(current: number, length: number) {
  const nextValue = current + 1;
  return nextValue >= length ? 0 : nextValue;
}
