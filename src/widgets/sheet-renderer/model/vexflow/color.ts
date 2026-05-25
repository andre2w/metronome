export function hexColorToRGB(hexCode: string, alpha?: number) {
  const r = Number.parseInt(hexCode.substring(1, 3), 16);
  const g = Number.parseInt(hexCode.substring(3, 5), 16);
  const b = Number.parseInt(hexCode.substring(5), 16);
  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

function p3ValueToRBGValue(color: number) {
  return Math.ceil(255 * color);
}

function parseDisplayP3Color(color: string) {
  const [_, r, g, b] = color.split(" ");
  return `rgba(${p3ValueToRBGValue(Number(r))}, ${p3ValueToRBGValue(Number(g))}, ${p3ValueToRBGValue(Number(b.replace(")", "")))}, 0.6)`;
}

export function getRgbaColorString(el: HTMLElement) {
  const selectedColor = getComputedStyle(el).getPropertyValue("--accent-9");
  return selectedColor.startsWith("color(")
    ? parseDisplayP3Color(selectedColor)
    : hexColorToRGB(selectedColor, 0.6);
}
