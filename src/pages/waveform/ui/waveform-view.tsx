import { useCallback, useEffect, useState } from "react";
import { useWaveform } from "./use-waveform";
import { calculateBeatTime } from "~/pages/metronome/model/beat-time";
import { UploadFileArea } from "./upload-file-area";
import { Button, Flex } from "@radix-ui/themes";
import { useWaveSurfer } from "./wave-surfer-context/use-wave-surfer";
import { Controls } from "./controls";
import { Regions } from "./regions";

// Give regions a random color when they are created
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

export function WaveformView() {
  const { init, loadFile, isLoaded, playPause } = useWaveSurfer();
  const onLoadFile = useCallback(
    (files: FileList) => {
      if (isLoaded) {
        return;
      }
      const file = files[0];
      if (file && file.size > 0) {
        loadFile(file);
      }
    },
    [loadFile],
  );

  return (
    <div>
      {!isLoaded && (
        <Flex width="100%" justify="center">
          <UploadFileArea onLoad={onLoadFile}>Upload your song</UploadFileArea>
        </Flex>
      )}
      {isLoaded && <Controls />}
      <div
        ref={(el) => {
          if (el && !isLoaded) {
            init(el);
          }
        }}
      />
      <Regions />
    </div>
  );
}
