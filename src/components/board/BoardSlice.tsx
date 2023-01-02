import { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import BoardArcElement from './BoardArcElement';
import { Color, newColor } from '../../utils/colors';
import { SlicePart } from '../../utils/darts';

type BoardSliceProps = {
  number: number;
  angle: number;
  darkSlice: boolean;
  overlayColors?: Partial<Record<SlicePart, Color>>;
  onActivate?: (number: number, part: SlicePart) => void;
  onDeactivate?: (number: number, part: SlicePart) => void;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const BoardSlice = ({
  number,
  angle,
  darkSlice,
  overlayColors,
  onActivate,
  onDeactivate,
  onTrigger,
}: BoardSliceProps) => {
  const doubleColor = darkSlice
    ? newColor(121, 8, 29)
    : newColor(23, 82, 13);
  const singleColor = darkSlice
    ? newColor(0, 0, 0)
    : newColor(255, 255, 255);

  return (
    <g style={{ transform: `rotate(${angle}deg)` }}>
      <BoardArcElement
        startAngle={-9}
        innerRadius={20}
        outerRadius={60}
        color={singleColor}
        overlayColor={overlayColors?.['inner']}
        onActivate={() => onActivate?.(number, 'inner')}
        onDeactivate={() => onDeactivate?.(number, 'inner')}
        onTrigger={() => onTrigger?.(number, 'inner')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={60}
        outerRadius={75}
        color={doubleColor}
        overlayColor={overlayColors?.['triple']}
        onActivate={() => onActivate?.(number, 'triple')}
        onDeactivate={() => onDeactivate?.(number, 'triple')}
        onTrigger={() => onTrigger?.(number, 'triple')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={75}
        outerRadius={110}
        color={singleColor}
        overlayColor={overlayColors?.['outer']}
        onActivate={() => onActivate?.(number, 'outer')}
        onDeactivate={() => onDeactivate?.(number, 'outer')}
        onTrigger={() => onTrigger?.(number, 'outer')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={110}
        outerRadius={127}
        color={doubleColor}
        overlayColor={overlayColors?.['double']}
        onActivate={() => onActivate?.(number, 'double')}
        onDeactivate={() => onDeactivate?.(number, 'double')}
        onTrigger={() => onTrigger?.(number, 'double')}
      />
      <text
        x={0}
        y={-148}
        textAnchor="middle"
        alignmentBaseline="central"
        className="board-number"
      >
        {number}
      </text>
    </g>
  );
};

export default BoardSlice;
