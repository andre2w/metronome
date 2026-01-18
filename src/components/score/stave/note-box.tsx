import { Box, type BoxProps } from "@radix-ui/themes";
import type { Key, ReactNode } from "react";
import "./note-box.css";

export interface NoteBoxProps {
  children?: ReactNode;
  key?: Key;
  squared?: boolean;
  onClick?: BoxProps["onClick"];
  className?: string;
}
export function NoteBox({
  children,
  key,
  squared,
  onClick,
  className,
}: NoteBoxProps) {
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
