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
  onTrigger?: () => void;
};

const BoardCircleElement = ({
  radius,
  color,
  overlayColor,
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
      fill={fillColor}
      strokeWidth={0.1}
      stroke={'black'}
    />
  );
};

export default BoardCircleElement;
