import { CSSProperties, MouseEventHandler } from 'react';
import { Property } from 'csstype';

export type BoxProps = {
  children: React.ReactNode;
  flexDirection?: Property.FlexDirection;
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  padding?: Property.Padding<string | number>;
  onClick?: MouseEventHandler;
  gap?: number;
  style?: CSSProperties;
};

export default function Box({
  children,
  style,
  flexDirection = 'column',
  justifyContent,
  alignItems = 'stretch',
  padding,
  gap,
  onClick,
}: BoxProps) {
  return (
    <div
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection,
        justifyContent,
        alignItems,
        padding,
        gap,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
