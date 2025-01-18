import { Flow } from "vexflow";
import { Score, NOTES } from "../lib/types";
import { useRef, useState } from "react";

export interface UseVexflowProps {
  element: HTMLCanvasElement | null;
}

export function useVexflow() {
  const rendererRef = useRef<Flow.Renderer | undefined>();
  // const [renderer, setRenderer] = useState<Flow.Renderer | undefined>();
  // if (!renderer && element) {
  //   setRenderer(new Flow.Renderer(element, Flow.Renderer.Backends.CANVAS));
  // }

  const draw = (element: HTMLDivElement | null) => {
    if (!element) {
      console.error("Element not present");
      return;
    }
    if (!rendererRef.current) {
      rendererRef.current = new Flow.Renderer(element, Flow.Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;

    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.clear();

    const stave = new Flow.Stave(10, 40, 400);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    const notes = [
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
      new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    ];

    // const beam = new Flow.Beam(notes);
    Flow.Formatter.FormatAndDraw(context, stave, notes);

    // beam.setContext(context).draw();
    // for (const bar of score) {
    //   const stave = new Flow.Stave(10, 40, 400);
    //   stave.addClef("treble").addTimeSignature("4/4");

    //   const notes: Flow.StaveNote[] = [];
    //   for (const note of bar) {
    //     notes.push(
    //         new Flow.StaveNote({
    //         keys: note?.map((n) => NOTES[n]) ?? ["c/4"],
    //         duration: "8",
    //         }),
    //     );
    //   }

    //     const voice = new Flow.Voice({ num_beats: 4, beat_value: 4 });
    //     voice.addTickables(notes);

    //     new Flow.Formatter().joinVoices([voice]).format([voice], 350);

    //     stave.setContext(context).draw();
    //     voice.draw(context, stave);
    // }
  };

  return { draw };
}
