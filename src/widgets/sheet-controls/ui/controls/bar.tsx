import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import "./bar.css";
import { Bar as ScoreBar } from "~/shared/lib/score/score";
import { Part } from "./part";
import React, { ComponentProps } from "react";
import { MetronomeCursor } from "~/shared/lib/metronome";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";

export interface StaveProps extends ComponentProps<"div"> {
  bar: ScoreBar;
  barIndex: number;
  onHoverNote?: (cursor: MetronomeCursor | null) => void;
  onHoverBar?: (cursor: Pick<MetronomeCursor, "bar"> | null) => void;
}

export const Bar = React.memo(
  ({ bar, barIndex, onHoverNote, onHoverBar, ...props }: StaveProps) => {
    const removeBar = useScoreStore((state) => state.removeBar);
    const parts = bar.parts.flatMap((part, partIndex) => {
      return (
        <Part
          key={`Bar#${barIndex}#Part#${partIndex}`}
          part={part}
          barIndex={barIndex}
          partIndex={partIndex}
          onHoverNote={onHoverNote}
        />
      );
    });

    const onMouseEnter = onHoverBar ? () => onHoverBar({ bar: barIndex }) : undefined;
    const onMouseLeave = onHoverBar ? () => onHoverBar(null) : undefined;

    return (
      <div className="stave" {...props} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className="stave-content">
          <Text>{barIndex + 1}</Text>
          <Button onClick={() => removeBar(barIndex)} variant="ghost" aria-label="Remove bar">
            <Cross1Icon />
          </Button>
        </div>
        <div className="stave-notes">{parts}</div>
      </div>
    );
  },
);
