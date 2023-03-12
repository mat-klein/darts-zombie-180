import { CSSProperties } from 'react';

export type OverlayBoxProps = {
  children: React.ReactNode;
  hide?: boolean;
  flexDirection?: 'row' | 'column';
  style?: CSSProperties;
};

export default function OverlayBox({
  hide,
  children,
  style,
  flexDirection = 'column',
}: OverlayBoxProps) {
  return (
    <div
      style={{
        display: hide ? 'none' : 'flex',
        flexDirection,
        position: 'absolute',
        backgroundColor: 'rgba(220,220,220,0.6)',
        borderRadius: 8,
        padding: 0,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        alignItems: 'stretch',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
