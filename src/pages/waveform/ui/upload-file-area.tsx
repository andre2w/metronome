import { Button } from "@radix-ui/themes";
import { ChangeEvent, ReactNode, useCallback, useRef } from "react";
import classes from "./upload-file-area.module.scss";

export interface UploadFileAreaProps {
  children: ReactNode;
  onLoad?: (files: FileList) => void;
}

export function UploadFileArea({ children, onLoad }: UploadFileAreaProps) {
  const uploadButton = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      if (e.target.files) {
        onLoad?.(e.target.files);
      }
    },
    [onLoad],
  );

  return (
    <div>
      <Button
        className={classes.uploadFileButton}
        onClick={(e) => {
          e.preventDefault();
          if (uploadButton.current) {
            uploadButton.current.click();
          }
        }}
      >
        {children}
      </Button>
      <input
        ref={uploadButton}
        className={classes.uploadFileInput}
        type="file"
        onChange={onChange}
      />
    </div>
  );
}
