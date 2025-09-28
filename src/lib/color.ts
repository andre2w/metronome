export function hexColorToRGB(hexCode: string, alpha?: number) {
  const r = Number.parseInt(hexCode.substring(1, 3), 16);
  const g = Number.parseInt(hexCode.substring(3, 5), 16);
  const b = Number.parseInt(hexCode.substring(5), 16);

  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}
