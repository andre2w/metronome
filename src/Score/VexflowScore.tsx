import { useEffect, useRef } from "react";
import { NOTES, Score } from "../lib/types";
import { calculateWidthAndPosition } from "./helpers";
import { Flow } from "vexflow";

export function VexflowScore({ score }: { score: Score }) {
    const divRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<Flow.Renderer | undefined>();

    useEffect(() => {
        if (!divRef.current)  {
            return;
        }
        if (!rendererRef.current) {
            rendererRef.current = new Flow.Renderer(divRef.current, Flow.Renderer.Backends.SVG);
        }

        const element = divRef.current;
        const sheetWidth = element.getBoundingClientRect().width;
        const positions = calculateWidthAndPosition({
            sheetWidth: sheetWidth - 20,
            staveCount: score.length,
            staveHeight: 150,
            staveWidth: 300,
            startY: 10,
            startX: 10
        });
        const height = positions.reduce((prev, curr) => Math.max(prev, curr.y + 150)  , 0);

        const renderer = rendererRef.current;


        renderer.resize(sheetWidth, height);
        const context = renderer.getContext();
        context.clear();

        if (!score.length) {
            const stave = new Flow.Stave(0, 0, 0);
            stave.setContext(context).draw();
            Flow.Formatter.FormatAndDraw(context, stave, [], {
                auto_beam: true,
                align_rests: true,
            });
            return;
        }

        for (let i = 0; i < score.length; i++) {
            const position = positions[i];
            const stave = new Flow.Stave(position.x, position.y, position.width);

            if (i === 0) {
                stave.addClef("treble").addTimeSignature("4/4");
            }

            const bars = score[i];

            const notes = [];
            const duration = String(bars.length);
            for (const bar of bars) {
                if (bar && bar.length) {
                const note = bar.map(part => NOTES[part]);
                notes.push(new Flow.StaveNote({ keys: note, duration }));
                } else {
                notes.push(new Flow.GhostNote({ duration }));
                }
            }

            stave.setContext(context).draw();
            Flow.Formatter.FormatAndDraw(context, stave, notes, {
                auto_beam: true,
                align_rests: true,
            });
        }
    }, [score]);

    return <div style={{ backgroundColor: "wheat", marginTop: "10px" }} ref={divRef}></div>;
}