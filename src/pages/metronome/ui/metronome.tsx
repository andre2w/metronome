import { SheetRenderer } from "~/widgets/sheet-renderer";
import { SheetControls } from "~/widgets/sheet-controls";
import { MetronomeHeader } from "./header";
import { useCallback, useRef } from "react";
import { SheetRendererRef } from "~/widgets/sheet-renderer/ui/sheet-renderer";
import { MetronomeCursor } from "~/shared/lib/metronome";
import { useScoreStore } from "~/entities/score/model/state/score-store-provider";
import { useWakeLock } from "~/shared/lib/wake-lock";
import styles from "./metronome.module.scss";

export function Metronome() {
  const sheetRendererRef = useRef<SheetRendererRef>(null);
  const started = useScoreStore((store) => store.metronome.started);

  // Keep the screen awake while the metronome is running so it doesn't lock,
  // especially useful when practicing hands-free from a phone/tablet.
  useWakeLock(started);

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
    <div>
      <div className={started ? styles["header-collapsed"] : undefined}>
        <MetronomeHeader />
      </div>
      <div className={`${styles["full-bleed"]} ${started ? styles["sheet-fullscreen"] : ""}`}>
        <SheetRenderer ref={sheetRendererRef} />
      </div>
      {!started && (
        <div className={styles["full-bleed"]}>
          <SheetControls onHoverNote={onHoverNote} onHoverBar={onHoverBar} />
        </div>
      )}
    </div>
  );
}
