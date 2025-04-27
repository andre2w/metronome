import { Flex } from "@radix-ui/themes";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import "../Metronome.css";
import { nextInLoop } from "../../utils";

export interface TicksProps {
  notes: number;
}

export interface TicksHandle {
  next: () => void;
  clear: () => void;
}

export const Ticks = forwardRef<TicksHandle, TicksProps>((props, ref) => {
  const ticksRef = useRef<HTMLDivElement>(null);
  const selectedIndex = useRef(-1);

  const select = useCallback((index: number) => {
    ticksRef.current?.children.item(index)?.classList.add("selected");
  }, []);

  const deselect = useCallback((index: number) => {
    ticksRef.current?.children.item(index)?.classList.remove("selected");
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        next: () => {
          deselect(selectedIndex.current);
          selectedIndex.current = nextInLoop(
            selectedIndex.current,
            props.notes,
          );
          select(selectedIndex.current);
        },

        clear: () => {
          deselect(selectedIndex.current);
          selectedIndex.current = -1;
        },
      };
    },
    [props.notes, deselect, select],
  );

  return (
    <Flex justify="between" gap="2" ref={ticksRef}>
      {Array.from({ length: props.notes }).map((_, index) => {
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: We count the tempo using numbers just like the index
            key={index}
            className={`metronome-tick ${index % (props.notes / 4) === 0 ? "metronome-tick-big" : "metronome-tick-small"}`}
          />
        );
      })}
    </Flex>
  );
});
