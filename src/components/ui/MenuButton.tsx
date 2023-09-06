import { MouseEventHandler, useState } from "react";

type Sizes = "large" | "default" | "small";

export type MenuButtonProps = {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
  isActive?: boolean;
  disabled?: boolean;
  size?: Sizes;
};

export function MenuButton({
  children,
  disabled,
  onClick,
  isActive,
  size,
}: MenuButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: size === "large" ? "100%" : size === "small" ? 240 : 320,
        height: size === "large" ? 64 : size === "small" ? 32 : 48,
        fontSize: size === "large" ? 24 : size === "small" ? 16 : 20,
        fontWeight:
          size === "large" ? "bold" : size === "small" ? "lighter" : "normal",
        lineHeight:
          size === "large" ? "48px" : size === "small" ? "16px" : "32px",
        textAlign: "center",
        boxSizing: "border-box",
        backgroundColor: disabled
          ? "#B3B3B3"
          : isPressed
          ? "#0A301D"
          : "#22634F",
        color: disabled ? "#808080" : "#E6E6E6",
        borderRadius: 4,
        padding: 8,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
      }}
      onClick={disabled ? undefined : onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
