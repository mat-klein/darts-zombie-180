import { ReactNode } from 'react';

export type MenuHeaderProps = {
  children: ReactNode;
};

export function MenuHeader({ children }: MenuHeaderProps) {
  return <h2 style={{ margin: 0 }}>{children}</h2>;
}
