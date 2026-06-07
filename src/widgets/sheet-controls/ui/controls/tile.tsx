import { Box } from "@radix-ui/themes";
import { ComponentRef, forwardRef, Key, ReactNode } from "react";
import "./tile.css";

export interface TileProps {
  key?: Key;
  className?: string;
  onClick?: () => void | Promise<void>;
  children: ReactNode;
  variant?: "selected";
}

export const Tile = forwardRef<ComponentRef<"div">, TileProps>(
  ({ children, className, key, onClick, variant, ...props }, ref) => {
    return (
      <Box
        {...props}
        ref={ref}
        key={key}
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
