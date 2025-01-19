import { useEffect, useRef } from "react";
import { Score } from "../lib/types";
import { useVexflow } from "./useVexflow";

export interface VexflowScoreProps {
    score: Score;
}

export function VexflowScore({ score }: VexflowScoreProps) {
    const { draw } = useVexflow();
    const scoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scoreRef.current) {
            draw(score, scoreRef.current);
        }
    }, [scoreRef.current, score])

    return <div style={{ backgroundColor: "wheat", marginTop: "10px" }} ref={scoreRef}></div>
}