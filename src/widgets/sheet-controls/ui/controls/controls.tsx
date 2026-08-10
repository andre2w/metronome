import { Box, Button, Text } from "@radix-ui/themes";
import { Bar } from "./bar";
import "./controls.css";
import { ListScores } from "../list-scores";
import { SaveScore } from "../save-score";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { useMemo } from "react";

export function Controls() {
  const { addStave, clear, removeStave } = useScoreStoreShallow(
    ({ addBar: addStave, removeBar: removeStave, clear }) => ({
      addStave,
      removeStave,
      clear,
    }),
  );
  const bars = useScoreStoreShallow((state) => state.score.bars);
  const configuration = useConfiguration();
  const instrumentKeys = useMemo(() => {
    return Object.entries(configuration.keys());
  }, [configuration]);

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
              Tempo
            </Text>
          </Box>
          <Box height="35px" className="part-name">
            <Text as="p" wrap="nowrap" align="right">
              Stickings
            </Text>
          </Box>
          {instrumentKeys.map(([part, data]) => (
            <Box height="35px" key={part} className="part-name">
              <Text as="p" wrap="nowrap" align="right">
                {`${data.label}${Object.hasOwn(data, "modifiers") ? " *" : ""}`}
              </Text>
            </Box>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }} role="list">
          {bars.map((bar, staveIndex) => {
            return (
              <Bar
                key={`Bar#${staveIndex}`}
                role="listitem"
                bar={bar}
                barIndex={staveIndex}
                onRemoveStave={() => removeStave(staveIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
