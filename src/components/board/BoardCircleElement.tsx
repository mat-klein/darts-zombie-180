import { useEffect, useRef, useState } from 'react';

type BoardCircleElementProps = {
  radius: number;
  color: string;
  onTrigger?: () => void;
};

const BoardCircleElement = ({
  radius,
  color,
  onTrigger,
}: BoardCircleElementProps) => {
  const [active, setActive] = useState(false);
  const ref = useRef<any>();

  const onActivate = () => {
    setActive(true);
  };

  const onDeactivate = () => {
    setActive(false);
  };

  const onTriggerElement = () => {
    setActive(false);
    onTrigger?.();
  };

  useEffect(() => {
    ref.current.addEventListener(
      'board-element:activate',
      onActivate
    );
    ref.current.addEventListener(
      'board-element:deactivate',
      onDeactivate
    );
    ref.current.addEventListener(
      'board-element:trigger',
      onTriggerElement
    );

    return () => {
      ref.current.removeEventListener(
        'board-element:activate',
        onActivate
      );
      ref.current.removeEventListener(
        'board-element:deactivate',
        onDeactivate
      );
      ref.current.removeEventListener(
        'board-element:trigger',
        onTriggerElement
      );
    };
  }, []);

  return (
    <circle
      ref={ref}
      cx="0"
      cy="0"
      r={radius}
      fill={active ? 'yellow' : color}
    />
  );
};

export default BoardCircleElement;
