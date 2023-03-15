import { CSSProperties } from 'react';
import { SquareButton } from './SquareButton';

export type ModalProps = {
  children: React.ReactNode;
  style?: CSSProperties;
  hideClose?: boolean;
  onClose?: () => void;
};

export default function Modal({
  children,
  hideClose,
  onClose,
  style,
}: ModalProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(140,140,140,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          bottom: 8,
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 12,
          alignItems: 'stretch',
          gap: 12,
          ...style,
        }}
      >
        {!hideClose && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <SquareButton onClick={onClose}>X</SquareButton>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
