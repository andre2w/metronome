export function convertToMinutes(elapsed: number) {
  const minutes = Math.trunc(elapsed / 60);
  const seconds = Math.trunc(elapsed % 60);

  return `${formatToDoubleDigits(minutes)}:${formatToDoubleDigits(seconds)}`;
}

function formatToDoubleDigits(time: number) {
  return time >= 10 ? `${time}` : `0${time}`;
}
