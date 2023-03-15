import { MouseEventHandler, useState } from 'react';

type Sizes = 'large' | 'default' | 'small';

export type SquareButtonProps = {
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  size?: Sizes;
  onClick?: MouseEventHandler;
};

export function SquareButton({
  isActive,
  disabled,
  size,
  children,
  onClick,
}: SquareButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div
      style={{
        flex: `0 0 ${
          size === 'large' ? 64 : size === 'small' ? 32 : 48
        }px`,
        height: size === 'large' ? 64 : size === 'small' ? 32 : 48,
        width: size === 'large' ? 64 : size === 'small' ? 32 : 48,
        fontSize: size === 'large' ? 40 : size === 'small' ? 20 : 32,
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
        opacity: disabled ? 0.5 : undefined,
      }}
      onClick={disabled ? undefined : onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
