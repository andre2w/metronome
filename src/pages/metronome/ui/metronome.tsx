import "./metronome.css";
import { SheetRenderer } from "~/widgets/sheet-renderer";
import { SheetControls } from "~/widgets/sheet-controls";
import { MetronomeHeader } from "./header";
import { useCallback, useRef } from "react";
import { SheetRendererRef } from "~/widgets/sheet-renderer/ui/sheet-renderer";
import { MetronomeCursor } from "~/shared/lib/metronome";

export function Metronome() {
  const sheetRendererRef = useRef<SheetRendererRef>(null);

  const onHoverNote = useCallback(
    (cursor: MetronomeCursor | null) => {
      if (sheetRendererRef.current) {
        sheetRendererRef.current.hightlightNote(cursor);
      }
    },
    [sheetRendererRef],
  );

  const onHoverBar = useCallback(
    (cursor: Pick<MetronomeCursor, "bar"> | null) => {
      if (sheetRendererRef.current) {
        sheetRendererRef.current.hightlightBar(cursor);
      }
    },
    [sheetRendererRef],
  );

  return (
    <>
      <MetronomeHeader />
      <SheetRenderer ref={sheetRendererRef} />
      <SheetControls onHoverNote={onHoverNote} onHoverBar={onHoverBar} />
    </>
  );
}
