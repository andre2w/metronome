import { useEffect, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { Renderer } from "vexflow";
import type { Score } from "../lib/types";
import { drawScore } from "./draw-score";

export function VexflowScore({ score }: { score: Score }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<Renderer | undefined>();
  const scoreSize = useResizeObserver({
    ref: divRef,
  });

  useEffect(() => {
    if (!divRef.current) {
      return;
    }
    
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(divRef.current, Renderer.Backends.SVG);
    }

    const element = divRef.current;
    const sheetWidth = scoreSize.width ?? element.getBoundingClientRect().width;
    const renderer = rendererRef.current;

    drawScore({ renderer, score, sheetWidth});   
  }, [score, scoreSize.width]);

  return (
    <div style={{ marginTop: "10px" }} ref={divRef}>
      <img
        alt="cursor"
        id="cursor"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAABCAYAAAAxUOUbAAAAAXNSR0IArs4c6QAAAC5JREFUGFdjfPr7acOFH+cYQPj8r4sM937dYSAVKLGpMBiy6TMYcJgwGHAYMAAAGFUPRw5ILS0AAAAASUVORK5CYII="
        width="21"
        height="300"
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          right: 0,
          visibility: "hidden",
        }}
      />
    </div>
  );
}
