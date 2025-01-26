export interface CalculateWidthAndPositionProps {
  sheetWidth: number;
  staveWidth: number;
  staveHeight: number;
  staveCount: number;
  startY?: number;
  startX?: number;
}

export interface StavePosition {
  x: number;
  y: number; 
  width: number;
}

export function calculateWidthAndPosition(props: CalculateWidthAndPositionProps): StavePosition[] {
  console.log(props);
  if (props.staveCount < 1) {
    return []
  }

  if (props.staveCount === 1) {
    return [{ y: props.startY ?? 0, x: 0, width: props.sheetWidth }];
  }

  const lines: StavePosition[][] = [[]];
  let x = props.startX ?? 0;

  function fixLastLine() {
  const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width , 0);
  const staveCount = lines.at(-1)?.length;
  if (lineWidth && staveCount) {
    const staveDifference = Math.floor((props.sheetWidth / staveCount));
    let x = props.startX ?? 0;
    for (let i = 0; i < lines[lines.length - 1].length; i++) {
      lines[lines.length - 1][i].width = staveDifference;
      lines[lines.length - 1][i].x = x;
      x+= staveDifference;
    }
  }
  }

  for (let i = 0; i < props.staveCount; i++) {
    const lineWidth = lines.at(-1)?.reduce((total, stave) => total + stave.width , 0);
    if (lineWidth && lineWidth + props.staveWidth > props.sheetWidth) {
      fixLastLine();
      lines.push([]);
      x = props.startX ?? 0;
    }
 
    const line = lines.at(-1);
    const y = (props.startY ?? 0) + (props.staveHeight * (lines.length - 1));
    line?.push({ y, x, width: props.staveWidth });
    x += props.staveWidth;
  }

  fixLastLine();

  return lines.flat();
}
