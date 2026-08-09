import { Part as ScorePart, Tempo } from "~/shared/lib/score/score";
import { counting } from "../../model/constants";
import { Note } from "./note";
import { Box, Flex, Text } from "@radix-ui/themes";

export interface PartProps {
  part: ScorePart;
  barIndex: number;
  partIndex: number;
  className?: string;
}

export function Part({ part, barIndex, className, partIndex }: PartProps) {
  const tempoCounting = counting[part.tempo];

  const notes = part.notes.map((note, noteIndex) => {
    const noteCount = tempoCounting?.[partIndex]?.[noteIndex];

    if (!noteCount) {
      throw new Error(
        `No counting for bar at ${JSON.stringify({ staveIndex: barIndex, partIndex, note })}`,
      );
    }

    const withSpace = ["2", "3", "4"].includes(noteCount);

    return (
      <Note
        key={`${barIndex}#${partIndex}#${noteIndex}`}
        noteCount={noteCount}
        index={{ barIndex, partIndex, noteIndex }}
        className={withSpace ? "with-space-left" : undefined}
      />
    );
  });

  return (
    <Flex direction="column" className={className}>
      <Box height="35px" className="part-name" style={{ justifyContent: "center" }}>
        <Text as="p" wrap="nowrap" align="right">
          {tempoLabel(part.tempo)}
        </Text>
      </Box>
      <Flex direction="row">{notes}</Flex>
    </Flex>
  );
}

function tempoLabel(tempo: Tempo) {
  switch (tempo) {
    case "quarter":
      return "1/4";
    case "eights":
      return "1/8";
    case "sixteens":
      return "1/16";
    case "triplet":
      return "1/3";
  }
}
