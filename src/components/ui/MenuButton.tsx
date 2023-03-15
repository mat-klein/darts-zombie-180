import { MouseEventHandler, useState } from 'react';

export type MenuButtonProps = {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
  disabled?: boolean;
};

export function MenuButton({
  children,
  disabled,
  onClick,
}: MenuButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        height: 64,
        fontSize: 24,
        lineHeight: '40px',
        textAlign: 'center',
        boxSizing: 'border-box',
        backgroundColor: disabled
          ? 'rgba(204,204,157,0.5)'
          : isPressed
          ? 'rgba(204,204,157,0.7)'
          : 'rgba(224,224,187,0.9)',
        color: disabled ? '#AA8' : '#000',
        borderRadius: 8,
        padding: 12,
      }}
      onClick={disabled ? undefined : onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
