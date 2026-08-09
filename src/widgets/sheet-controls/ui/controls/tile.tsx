import { Box, BoxProps } from "@radix-ui/themes";
import { ComponentRef, forwardRef, ReactNode } from "react";
import "./tile.css";

export interface TileProps extends Exclude<BoxProps, { as: "span" }> {
  children: ReactNode;
  variant?: "selected";
}

export const Tile = forwardRef<ComponentRef<"div">, TileProps>(
  ({ children, className, onClick, variant, ...props }, ref) => {
    return (
      <Box
        {...props}
        role={"button"}
        ref={ref}
        height="35px"
        width="35px"
        className={`tile ${variant === "selected" ? "selected" : "not-selected"} ${className ?? ""}`}
        onClick={onClick}
      >
        {children}
      </Box>
    );
  },
);
