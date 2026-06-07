import { Box, Button, Text } from "@radix-ui/themes";
import { Stave } from "./stave";
import "./controls.css";
import { ListScores } from "../list-scores";
import { SaveScore } from "../save-score";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { NOTES } from "~/entities/score/model/notes";

export function Controls() {
  const { addStave, clear, removeStave, score } = useScoreStoreShallow(
    ({ addStave, score, toggleNote, removeStave, setSticking, clear }) => ({
      addStave,
      score,
      toggleNote,
      removeStave,
      setSticking,
      clear,
    }),
  );

  return (
    <section className="sheet-maker">
      <header className="sheet-maker-header">Score Editor</header>
      <div className="add">
        <Button onClick={addStave}>Add stave</Button>
        <SaveScore />
        <ListScores />
        <Button variant="surface" onClick={() => clear()}>
          New score
        </Button>
      </div>
      <div className="sheet">
        <div className="parts">
          <Box height="35px" className="part-name">
            <Text as="p" wrap="nowrap" align="right">
              Stickings
            </Text>
          </Box>
          {Object.entries(NOTES).map(([part, data]) => (
            <Box height="35px" key={part} className="part-name">
              <Text as="p" wrap="nowrap" align="right">
                {`${data.label}${Object.hasOwn(data, "modifiers") ? " *" : ""}`}
              </Text>
            </Box>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {score.map((bar, staveIndex) => {
            return (
              <Stave
                bar={bar}
                staveIndex={staveIndex}
                onRemoveStave={() => removeStave(staveIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
