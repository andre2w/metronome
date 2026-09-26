import { Box, BoxProps } from "@radix-ui/themes";
import { ComponentRef, forwardRef, ReactNode } from "react";
import styles from "./controls.module.scss";

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
        className={`${styles.tile} ${variant === "selected" ? styles.selected : styles["not-selected"]} ${className ?? ""}`}
        onClick={onClick}
      >
        {children}
      </Box>
    );
  },
);
