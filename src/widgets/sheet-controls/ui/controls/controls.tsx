import { Button, Text } from "@radix-ui/themes";
import { NOTES, type Note } from "../../../../entities/score/model/types";
import { Stave } from "./stave";
import "./controls.css";
import { ListScores } from "../list-scores";
import { SaveScore } from "../save-score";
import { StaveNoteBox } from "./stave-note-box";
import { useScoreStoreShallow } from "~/entities/score/model/state/score-store-provider";
import { noteLabel } from "../../model/constants";

export function Controls() {
  const { addStave, clear, removeStave, score, setSticking, toggleNote } = useScoreStoreShallow(
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
    <>
      <div className="sheet-maker">
        <div className="add">
          <Button onClick={addStave}>Add stave</Button>
          <SaveScore />
          <ListScores />
          <Button
            onClick={() => {
              clear();
            }}
          >
            New Score
          </Button>
        </div>
        <div className="sheet">
          <div className="parts">
            <StaveNoteBox className="part-name">
              <Text as="p" wrap="nowrap" align="right">
                Stickings
              </Text>
            </StaveNoteBox>
            {Object.keys(NOTES).map((note) => (
              <StaveNoteBox key={note} className="part-name">
                <Text as="p" wrap="nowrap" align="right">
                  {noteLabel[note as Note]}
                </Text>
              </StaveNoteBox>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {score.map((bar, staveIndex) => {
              return (
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
      </div>
    </>
  );
}
