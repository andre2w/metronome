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

  const draw = (score: Score, element: HTMLDivElement | null) => {
    if (!element) {
      console.error("Element not present");
      return;
    }
    if (!rendererRef.current) {
      rendererRef.current = new Flow.Renderer(element, Flow.Renderer.Backends.SVG);
    }
    const renderer = rendererRef.current;

    renderer.resize(1000, 500);
    const context = renderer.getContext();
    context.clear();

    let x = 10;
    const a = score.map((bars, staveIndex) => {

      const stave = new Flow.Stave(x, 40, 400);
      x += 400;
      if (staveIndex === 0) {
        stave.addClef("treble").addTimeSignature("4/4");
      }

      const notes = [];
      const duration = String(bars.length);
      for (const bar of bars) {
        if (bar.length) {
          const note = bar.map(part => NOTES[part]);
          notes.push(new Flow.StaveNote({ keys: note, duration }));
        } else {
          notes.push(new Flow.GhostNote({ duration }));
        }
      }

      // stave.setContext(context).draw();
      return { stave, notes };
    });

    a.forEach(({ stave, notes }) => {
          // Flow.Formatter.FormatAndDraw(context, stave, notes, {
    //   auto_beam: true,
    //   align_rests: true,
    // });
      stave.setContext(context).draw();
      Flow.Formatter.FormatAndDraw(context, stave, notes, {
        auto_beam: true,
        align_rests: true,
      });
    })

    // renderer.resize(1000, 500);
    // const context = renderer.getContext();
    // context.clear();

    // const stave = new Flow.Stave(10, 40, 400);
    // stave.addClef("treble").addTimeSignature("4/4");
    // stave.setContext(context).draw();


    // const notes = [
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    // ];
    // const stave2 = new Flow.Stave(410, 40, 400);
    // stave2.setContext(context).draw();
    // const notes2 = [
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
    //   new Flow.GhostNote({ duration: "16" }),
    //   // new Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
    //   new Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
    // ];

    // const beam = new Flow.Beam(notes);
    // Flow.Formatter.FormatAndDraw(context, stave, notes, {
    //   auto_beam: true,
    //   align_rests: true,
    // });
    // Flow.Formatter.FormatAndDraw(context, stave2, notes2, {
    //   auto_beam: true,
    //   align_rests: true,
    // });
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
