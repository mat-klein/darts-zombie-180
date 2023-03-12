import { CSSProperties } from 'react';
import { SquareButton } from './SquareButton';

export type ModalProps = {
  children: React.ReactNode;
  style?: CSSProperties;
  onClose?: () => void;
};

export default function Modal({
  children,
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
          padding: 8,
          alignItems: 'stretch',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <SquareButton onClick={onClose}>X</SquareButton>
        </div>
        {children}
      </div>
    </div>
  );
}
