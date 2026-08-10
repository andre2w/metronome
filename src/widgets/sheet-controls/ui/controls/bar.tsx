import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import "./bar.css";
import { Bar as ScoreBar } from "~/shared/lib/score/score";
import { Part } from "./part";
import { ComponentProps } from "react";

export interface StaveProps extends ComponentProps<"div"> {
  bar: ScoreBar;
  barIndex: number;
  onRemoveStave: () => void;
}

export function Bar({ bar, barIndex, onRemoveStave, ...props }: StaveProps) {
  const parts = bar.parts.flatMap((part, partIndex) => {
    return (
      <Part
        key={`Bar#${barIndex}#Part#${partIndex}`}
        part={part}
        barIndex={barIndex}
        partIndex={partIndex}
      />
    );
  });

  return (
    <div className="stave" {...props}>
      <div className="stave-content">
        <Text>{barIndex + 1}</Text>
        <Button onClick={onRemoveStave} variant="ghost" aria-label="Remove bar">
          <Cross1Icon />
        </Button>
      </div>
      <div className="stave-notes">{parts}</div>
    </div>
  );
}
