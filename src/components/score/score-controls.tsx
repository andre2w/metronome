import { Button } from "@radix-ui/themes";
import { ScoreList } from "./score-list";
import { useScoreStore } from "../../lib/score/state";
import "./score-controls.css";
import { useShallow } from "zustand/shallow";
import { SaveScore } from "./save-score";

export function ScoreControls() {
  const { addStave, clear } = useScoreStore(
    useShallow(({ clear, addStave }) => ({
      clear,
      addStave,
    })),
  );

  return (
    <div className="controls">
      <Button onClick={() => addStave}>Add stave</Button>
      <SaveScore />
      <ScoreList />
      <Button onClick={() => clear()}>New Score</Button>
    </div>
  );
}
