import { CSSProperties } from 'react';
import { Property } from 'csstype';

export type BoxProps = {
  children: React.ReactNode;
  flexDirection?: Property.FlexDirection;
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  padding?: number;
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
}: BoxProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection,
        justifyContent,
        alignItems,
        padding,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
