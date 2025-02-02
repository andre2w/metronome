import { NotatorDropdown, type NotatorDropdownProps } from "./NotatorDropdown";
import { type Bar, type Note, NOTES } from "../lib/types";
import { Button, Text } from "@radix-ui/themes";
import { useScoreContext } from "../Score/ScoreProvider";
import { VexflowScore } from "../Score/VexflowScore";
import { Cross1Icon } from "@radix-ui/react-icons";

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
      <div
        style={{ marginTop: "auto", marginBottom: "15px", overflow: "scroll" }}
      >
        <div style={{ display: "flex" }}>
          <Button onClick={addStave}>Add new line</Button>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
        >
          <div style={{ alignSelf: "flex-end", position: "sticky" }}>
            <div>---</div>
            <div
              style={{
                height: "35px",
                boxSizing: "border-box",
                alignContent: "center",
                textAlign: "end",
                paddingRight: "5px",
              }}
            >
              Sticking
            </div>
            {Object.keys(NOTES).map((note) => (
              <div
                key={note}
                style={{
                  height: "35px",
                  boxSizing: "border-box",
                  alignContent: "center",
                  textAlign: "end",
                  paddingRight: "5px",
                }}
              >
                <Text as="p" wrap="nowrap">
                  {noteLabel[note as Note]}
                </Text>
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

const counting: { [k: number]: string[] } = {
  4: ["1", "2", "3", "4"],
  8: ["1", "&", "2", "&", "3", "&", "4", "&"],
  16: [
    "1",
    "e",
    "&",
    "a",
    "2",
    "e",
    "&",
    "a",
    "3",
    "e",
    "&",
    "a",
    "4",
    "e",
    "&",
    "a",
  ],
};

interface StaveProps {
  bar: Bar;
  index: number;
  onSelectNote: (
    barIndex: number,
    note: Parameters<NonNullable<NotatorDropdownProps["onSelect"]>>[0],
  ) => void;
  onRemoveStave: () => void;
  onSetStickings: (
    barIndex: number,
    sticking: Parameters<NonNullable<NotatorDropdownProps["onSetSticking"]>>[0],
  ) => void;
}
function Stave({
  bar,
  index,
  onSelectNote,
  onRemoveStave,
  onSetStickings,
}: StaveProps) {
  const tempoCounting = counting[bar.length];
  const notes = bar.map((notesWithSticking, noteIndex) => {
    const noteCount = tempoCounting[noteIndex];
    return (
      // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
      <NotatorDropdown
        noteCount={noteCount}
        index={index}
        notesWithSticking={notesWithSticking}
        onSelect={(note) => onSelectNote(noteIndex, note)}
        onSetSticking={(sticking) => onSetStickings(noteIndex, sticking)}
      />
    );
  });

  return (
    <div style={{ paddingRight: "5px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid wheat",
          marginBottom: "5px",
        }}
      >
        <Text>{index}</Text>
        <Button onClick={onRemoveStave} variant="ghost">
          <Cross1Icon />
        </Button>
      </div>
      <div style={{ display: "flex" }}>{notes}</div>
    </div>
  );
}
