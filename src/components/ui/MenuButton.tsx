import { MouseEventHandler, useState } from 'react';

export type MenuButtonProps = {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
};

export function MenuButton({ children, onClick }: MenuButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        height: 64,
        fontSize: 24,
        lineHeight: '40px',
        textAlign: 'center',
        boxSizing: 'border-box',
        backgroundColor: isPressed
          ? 'rgba(204,204,157,0.7)'
          : 'rgba(224,224,187,0.9)',
        borderRadius: 8,
        padding: 12,
      }}
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
