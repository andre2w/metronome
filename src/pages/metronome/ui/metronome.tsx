import "./metronome.css";
import { SheetRenderer } from "~/widgets/sheet-renderer";
import { SheetControls } from "~/widgets/sheet-controls";
import { MetronomeHeader } from "./header";

export function Metronome() {
  return (
    <>
      <MetronomeHeader />
      <SheetRenderer />
      <SheetControls />
    </>
  );
}
