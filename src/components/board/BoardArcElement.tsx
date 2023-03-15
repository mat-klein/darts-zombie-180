import { useEffect, useRef, useState } from 'react';
import { fromPolar } from '../../utils/coordinates';
import {
  Color,
  colorMultiply,
  colorToString,
  newColor,
} from '../../utils/colors';

type BoardArcElementProps = {
  startAngle: number;
  innerRadius: number;
  outerRadius: number;
  color: Color;
  overlayColor?: Color;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onTrigger?: () => void;
};

const BoardArcElement = ({
  startAngle,
  innerRadius,
  outerRadius,
  color,
  overlayColor,
  onActivate,
  onDeactivate,
  onTrigger,
}: BoardArcElementProps) => {
  function toSvgPtString(pt: [number, number]) {
    return pt[0] + ' ' + pt[1];
  }

  const p1 = toSvgPtString(fromPolar(startAngle, outerRadius));
  const p2 = toSvgPtString(fromPolar(startAngle + 18, outerRadius));
  const p3 = toSvgPtString(fromPolar(startAngle + 18, innerRadius));
  const p4 = toSvgPtString(fromPolar(startAngle, innerRadius));

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
    <path
      className="board-element"
      ref={ref}
      onTouchStart={(e) => {
        //setActive(true);
        if (e.touches.length == 1) {
        }
      }}
      onTouchEnd={(e) => {
        // setActive(false);
        if (e.touches.length == 1) {
        }
      }}
      onTouchMove={(e) => {
        // setActive(true);
        if (e.touches.length == 1) {
        }
      }}
      d={`M${p1}L${p2}L${p3}L${p4}L${p1}Z`}
      fill={fillColor}
      strokeWidth={0.07}
      stroke={'black'}
    />
  );
};

export default BoardArcElement;
