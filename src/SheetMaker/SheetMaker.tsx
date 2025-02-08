import { Button, Text } from "@radix-ui/themes";
import { useScoreContext } from "../Score/ScoreProvider";
import { VexflowScore } from "../Score/VexflowScore";
import { NOTES, type Note } from "../lib/types";
import { Stave } from "./Stave";
import "./SheetMaker.css";

const noteLabel: Record<Note, string> = {
  KICK: "Kick",
  SNARE: "Snare",
  SNARE_X_STICK: "Snare cross-stick",
  TOM_1: "Tom 1",
  TOM_2: "Tom 2",
  TOM_3: "Tom 2",
  HIGH_HAT: "High hat",
  HIGH_HAT_OPEN: "High hat open",
  HIGH_HAT_PEDAL: "High hat pedal",
  CRASH: "Crash",
  RIDE: "Pedal",
};

export function SheetMaker() {
  const { addStave, score, toggleNote, removeStave, setSticking } =
    useScoreContext();

  return (
    <>
      <VexflowScore score={score} />
      <div className="sheet-maker">
        <div style={{ display: "flex" }}>
          <Button onClick={addStave}>Add new line</Button>
        </div>
        <div className="sheet">
          <div className="parts">
            <div>---</div>
            <div className="part-name">
              Sticking
            </div>
            {Object.keys(NOTES).map((note) => (
              <div key={note} className="part-name">
                <Text as="p" wrap="nowrap">{noteLabel[note as Note]}</Text>
              </div>
            ))}
          </div>
          {score.map((bar, staveIndex) => {
            return (
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              <Stave
                bar={bar}
                index={staveIndex}
                onSelectNote={(staveNoteIndex, note) => {
                  toggleNote({ staveIndex, staveNoteIndex, note });
                }}
                onRemoveStave={() => removeStave(staveIndex)}
                onSetStickings={(staveNoteIndex, sticking) => {
                  setSticking({ staveIndex, staveNoteIndex, sticking });
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
