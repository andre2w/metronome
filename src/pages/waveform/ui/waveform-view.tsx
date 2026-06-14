import { useCallback } from "react";
import { UploadFileArea } from "./upload-file-area";
import { Flex } from "@radix-ui/themes";
import { useWaveSurfer } from "./wave-surfer-context/use-wave-surfer";
import { Controls } from "./controls";
import { Regions } from "./regions";

export function WaveformView() {
  const { init, loadFile, isLoaded } = useWaveSurfer();

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
