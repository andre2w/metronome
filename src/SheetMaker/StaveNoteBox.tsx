import { Box, type BoxProps } from "@radix-ui/themes";
import type { Key, ReactNode } from "react";
import "./StaveNoteBox.css";

export interface StaveNoteBoxProps {
  children?: ReactNode;
  key?: Key;
  squared?: boolean;
  onClick?: BoxProps["onClick"];
  className?: string;
}
export function StaveNoteBox({
  children,
  key,
  squared,
  onClick,
  className,
}: StaveNoteBoxProps) {
  return (
    <Box
      key={key}
      height={"35px"}
      width={squared ? "35px" : undefined}
      className={`stave-note-box ${className ? className : ""}`}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
