export function nextInLoop(current: number, length: number) {
  const nextValue = current + 1;
  return nextValue >= length ? 0 : nextValue;
}

export function nextValueInLoop<T>(items: T[], value: T) {
  const index = items.indexOf(value);
  if (index === -1) {
    throw new Error("Item is not in array");
  }
  const nextValue = items[nextInLoop(index, items.length)];
  if (!nextValue) {
    throw new Error("Could not find value in loop");
  }

  return nextValue;
}
