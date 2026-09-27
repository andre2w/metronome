import { Box, Button, Text } from "@radix-ui/themes";
import { Bar } from "./bar";
import styles from "./controls.module.scss";
import { ListScores } from "../list-scores";
import { SaveScore } from "../save-score";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { useConfiguration } from "~/shared/lib/configuration/configuration-provider";
import { useMemo } from "react";
import { MetronomeCursor } from "~/shared/lib/metronome";

export interface ControlProps {
  onHoverNote?: (cursor: MetronomeCursor | null) => void;
  onHoverBar?: (cursor: Pick<MetronomeCursor, "bar"> | null) => void;
}

export function Controls({ onHoverNote, onHoverBar }: ControlProps) {
  const { addStave, clear } = useScoreStoreShallow(({ addBar: addStave, clear }) => ({
    addStave,
    clear,
  }));
  const bars = useScoreStoreShallow((state) => state.score.bars);
  const configuration = useConfiguration();
  const instrumentKeys = useMemo(() => {
    return Object.entries(configuration.keys());
  }, [configuration]);

  return (
    <section className={styles["sheet-maker"]}>
      <header className={styles["sheet-maker-header"]}>Score Editor</header>
      <div className={styles.add}>
        <Button onClick={addStave}>Add stave</Button>
        <SaveScore />
        <ListScores />
        <Button variant="surface" onClick={() => clear()}>
          New score
        </Button>
      </div>
      <div className={styles.sheet}>
        <div className={styles.parts}>
          <Box height="35px" className={styles["part-name"]}>
            <Text as="p" wrap="nowrap" align="right">
              Tempo
            </Text>
          </Box>
          <Box height="35px" className={styles["part-name"]}>
            <Text as="p" wrap="nowrap" align="right">
              Stickings
            </Text>
          </Box>
          {instrumentKeys.map(([part, data]) => (
            <Box height="35px" key={part} className={styles["part-name"]}>
              <Text as="p" wrap="nowrap" align="right">
                {`${data.label}${Object.hasOwn(data, "modifiers") ? " *" : ""}`}
              </Text>
            </Box>
          ))}
        </div>
        <div className={styles.notes} role="list">
          {bars.map((bar, staveIndex) => {
            return (
              <Bar
                key={`Bar#${staveIndex}`}
                role="listitem"
                bar={bar}
                barIndex={staveIndex}
                onHoverNote={onHoverNote}
                onHoverBar={onHoverBar}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
