import { MouseEventHandler, ReactNode } from "react";

type Sizes = "large" | "default" | "small";

export type MenuHeaderProps = {
  children: ReactNode;
  onClick?: MouseEventHandler;
  size?: Sizes;
};

export function MenuHeader({ children, onClick, size }: MenuHeaderProps) {
  return (
    <div
      onClick={onClick}
      className={
        (size === "large"
          ? "text-5xl "
          : size === "small"
          ? "text-xl "
          : "text-3xl ") + "flex flex-row self-center gap-2"
      }
    >
      {children}
    </div>
  );
}
