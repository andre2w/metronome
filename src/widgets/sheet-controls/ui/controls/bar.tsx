import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Text } from "@radix-ui/themes";
import "./bar.css";
import { Bar as ScoreBar } from "~/shared/lib/score/score";
import { Part } from "./part";

export interface StaveProps {
  bar: ScoreBar;
  barIndex: number;
  onRemoveStave: () => void;
  className?: string;
}

export function Bar({ bar, barIndex, onRemoveStave }: StaveProps) {
  const parts = bar.parts.flatMap((part, partIndex) => {
    return <Part part={part} barIndex={barIndex} partIndex={partIndex} />;
  });

  return (
    <div className="stave">
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
