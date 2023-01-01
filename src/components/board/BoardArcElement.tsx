import { useEffect, useRef, useState } from 'react';
import { useHover } from 'usehooks-ts';
import { fromPolar } from '../../utils/coordinates';

type BoardArcElementProps = {
  startAngle: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
  onTrigger?: () => void;
};

const BoardArcElement = ({
  startAngle,
  innerRadius,
  outerRadius,
  color,
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
    <path
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
      fill={active ? 'yellow' : color}
    />
  );
};

export default BoardArcElement;