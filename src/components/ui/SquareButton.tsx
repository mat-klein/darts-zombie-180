import { MouseEventHandler, useState } from 'react';

export type SquareButtonProps = {
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: MouseEventHandler;
};

export function SquareButton({
  isActive,
  children,
  onClick,
}: SquareButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        height: 48,
        width: 48,
        fontSize: 32,
        lineHeight: '40px',
        textAlign: 'center',
        boxSizing: 'border-box',
        backgroundColor:
          isActive || isPressed
            ? 'rgba(204,204,157,0.7)'
            : 'rgba(224,224,187,0.9)',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: isActive ? 2 : 0,
        borderRadius: 8,
        padding: isActive ? 2 : 4,
      }}
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
