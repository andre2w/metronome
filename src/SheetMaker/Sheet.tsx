import { Button, Text } from "@radix-ui/themes";
import { useScoreContext } from "../Score/ScoreProvider";
import { VexflowScore, type VexflowScoreHandle } from "../Score/VexflowScore";
import { NOTES, type Note } from "../lib/types";
import { Stave } from "./Stave";
import "./Sheet.css";
import { useRef } from "react";
import type { BaseMetronomeConfigurationProps } from "../Metronome/configuration";
import { ListScores } from "./ListScores";
import { SaveScore } from "./SaveScore";
import { StaveNoteBox } from "./StaveNoteBox";

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

export interface SheetProps {
  configuration: BaseMetronomeConfigurationProps;
}

export function Sheet({ configuration }: SheetProps) {
  const { addStave, score, toggleNote, removeStave, setSticking } =
    useScoreContext();

  return (
    <>
      <div className="sheet-maker">
        <div className="add">
          <Button onClick={addStave}>Add new line</Button>
          <SaveScore
            score={score}
            beats={configuration.beats}
            graceTime={configuration.graceTime}
            notes={configuration.notes}
          />
          <ListScores />
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
