import { useState } from "react";
import type { FullScore } from "../../../lib/score/types";
import { Flex } from "@radix-ui/themes";
import { DeleteScore } from "./score-row-delete";
import { ScoreRowView } from "./score-row-view";

export interface ScoreRowProps {
  score: FullScore & { id: number };
  onLoad?: () => void;
  onDelete?: () => void;
}

export function ScoreRow({ score, onLoad, onDelete }: ScoreRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Flex
      justify="between"
      minHeight="50px"
      align={isDeleting ? "center" : undefined}
    >
      {isDeleting ? (
        <DeleteScore
          onDelete={() => onDelete?.()}
          onCancel={() => setIsDeleting(false)}
        />
      ) : (
        <ScoreRowView
          score={score}
          onDelete={() => setIsDeleting(true)}
          onLoad={() => onLoad?.()}
        />
      )}
    </Flex>
  );
}
