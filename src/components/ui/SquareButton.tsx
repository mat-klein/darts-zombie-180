import { MouseEventHandler, useState } from "react";

type Sizes = "large" | "default" | "small";
type Colors = "green" | "red" | "default";

export type SquareButtonProps = {
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  size?: Sizes;
  onClick?: MouseEventHandler;
  color?: Colors;
};

export function SquareButton({
  isActive,
  disabled,
  size,
  children,
  onClick,
  color,
}: SquareButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        flex: `0 0 ${size === "large" ? 64 : size === "small" ? 32 : 48}px`,
        height: size === "large" ? 64 : size === "small" ? 32 : 48,
        width: size === "large" ? 64 : size === "small" ? 32 : 48,
        fontSize: size === "large" ? 40 : size === "small" ? 20 : 32,
        textAlign: "center",
        boxSizing: "border-box",
        backgroundColor: isPressed
          ? "rgba(26,26,26,0.6)"
          : color === "green"
          ? "rgba(34,99,79,1)"
          : color === "red"
          ? "rgba(143,82,93,1)"
          : "transparent",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: isActive ? 2 : 0,
        borderRadius: 4,
        opacity: disabled ? 0.5 : undefined,
      }}
      onClick={disabled ? undefined : onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
