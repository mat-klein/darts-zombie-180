import { useEffect, useRef, useState } from 'react';
import {
  Color,
  colorMultiply,
  colorToString,
  newColor,
} from '../../utils/colors';

type BoardCircleElementProps = {
  radius: number;
  color: Color;
  overlayColor?: Color;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onTrigger?: () => void;
};

const BoardCircleElement = ({
  radius,
  color,
  overlayColor,
  onActivate,
  onDeactivate,
  onTrigger,
}: BoardCircleElementProps) => {
  const [active, setActive] = useState(false);
  const ref = useRef<any>();

  const oCol = active
    ? newColor(255, 255, 0)
    : overlayColor
    ? overlayColor
    : newColor(0, 0, 0, 0);
  const fillColor = colorToString(colorMultiply(color, oCol));

  const onActivateElement = () => {
    setActive(true);
    onActivate?.();
  };

  const onDeactivateElement = () => {
    setActive(false);
    onDeactivate?.();
  };

  const onTriggerElement = () => {
    setActive(false);
    onTrigger?.();
  };

  useEffect(() => {
    ref.current.addEventListener(
      'board-element:activate',
      onActivateElement
    );
    ref.current.addEventListener(
      'board-element:deactivate',
      onDeactivateElement
    );
    ref.current.addEventListener(
      'board-element:trigger',
      onTriggerElement
    );

    return () => {
      ref.current.removeEventListener(
        'board-element:activate',
        onActivateElement
      );
      ref.current.removeEventListener(
        'board-element:deactivate',
        onDeactivateElement
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
      fill={fillColor}
      strokeWidth={0.1}
      stroke={'black'}
      className="board-element"
    />
  );
};

export default BoardCircleElement;
