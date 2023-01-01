import { useEffect, useRef, useState } from 'react';
import { useHover } from 'usehooks-ts';

type SlicePart = 'outer' | 'double';

type BoardBullProps = {
  innerRadius: number;
  outerRadius: number;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const BoardBull = ({
  innerRadius,
  outerRadius,
  onTrigger,
}: BoardBullProps) => {
  const refInner = useRef<any>(null);
  const isHoverInner = useHover(refInner);
  const refOuter = useRef<any>(null);
  const isHoverOuter = useHover(refOuter);

  const innerColor = isHoverInner ? 'red' : '#79081D';

  const outerColor = isHoverOuter ? 'green' : '#17520D';

  const [activeInner, setActiveInner] = useState(false);
  const [activeOuter, setActiveOuter] = useState(false);

  const onActivateInner = () => {
    setActiveInner(true);
  };

  const onDeactivateInner = () => {
    setActiveInner(false);
  };

  const onTriggerElementInner = () => {
    setActiveInner(false);
    onTrigger?.(25, 'double');
  };

  const onActivateOuter = () => {
    setActiveOuter(true);
  };

  const onDeactivateOuter = () => {
    setActiveOuter(false);
  };

  const onTriggerElementOuter = () => {
    setActiveOuter(false);
    onTrigger?.(25, 'outer');
  };

  useEffect(() => {
    refInner.current.addEventListener(
      'board-element:activate',
      onActivateInner
    );
    refInner.current.addEventListener(
      'board-element:deactivate',
      onDeactivateInner
    );
    refInner.current.addEventListener(
      'board-element:trigger',
      onTriggerElementInner
    );
    refOuter.current.addEventListener(
      'board-element:activate',
      onActivateOuter
    );
    refOuter.current.addEventListener(
      'board-element:deactivate',
      onDeactivateOuter
    );
    refOuter.current.addEventListener(
      'board-element:trigger',
      onTriggerElementOuter
    );

    return () => {
      refInner.current.removeEventListener(
        'board-element:activate',
        onActivateInner
      );
      refInner.current.removeEventListener(
        'board-element:deactivate',
        onDeactivateInner
      );
      refInner.current.removeEventListener(
        'board-element:trigger',
        onTriggerElementInner
      );
      refOuter.current.removeEventListener(
        'board-element:activate',
        onActivateOuter
      );
      refOuter.current.removeEventListener(
        'board-element:deactivate',
        onDeactivateOuter
      );
      refOuter.current.removeEventListener(
        'board-element:trigger',
        onTriggerElementOuter
      );
    };
  }, []);

  return (
    <g>
      <circle
        ref={refOuter}
        cx="0"
        cy="0"
        r={outerRadius}
        fill={activeOuter ? 'yellow' : outerColor}
      />
      <circle
        ref={refInner}
        cx="0"
        cy="0"
        r={innerRadius}
        fill={activeInner ? 'yellow' : innerColor}
      />
    </g>
  );
};

export default BoardBull;
