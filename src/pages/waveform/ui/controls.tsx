import { Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { useEventSurferListener } from "./wave-surfer-context/use-event-surfer-listener";
import { useWaveSurfer } from "./wave-surfer-context/use-wave-surfer";
import { useHotkey } from "@tanstack/react-hotkeys";

export function Controls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playPause } = useWaveSurfer();

  useHotkey("Space", () => {
    playPause();
  });

  useEventSurferListener("play", () => {
    setIsPlaying(true);
  });
  useEventSurferListener("pause", () => {
    setIsPlaying(false);
  });

  return (
    <Flex>
      <Button
        onClick={() => {
          playPause();
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </Flex>
  );
}
