import { Button, Dialog } from "@radix-ui/themes";
import { useState } from "react";
import { SaveScoreForm } from "./save-score-form";

export function SaveScore() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button>Save Sheet</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Save sheet</Dialog.Title>
        <SaveScoreForm onSave={() => setIsOpen(false)} />
      </Dialog.Content>
    </Dialog.Root>
  );
}
