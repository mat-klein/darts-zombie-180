import { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import BoardArcElement from './BoardArcElement';

type SlicePart = 'inner' | 'triple' | 'outer' | 'double';

type BoardSliceProps = {
  number: number;
  angle: number;
  darkSlice: boolean;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const BoardSlice = ({
  number,
  angle,
  darkSlice,
  onTrigger,
}: BoardSliceProps) => {
  const doubleColor = darkSlice ? '#79081D' : '#17520D';
  const singleColor = darkSlice ? 'black' : 'white';

  return (
    <g style={{ transform: `rotate(${angle}deg)` }}>
      <BoardArcElement
        startAngle={-9}
        innerRadius={20}
        outerRadius={60}
        color={singleColor}
        onTrigger={() => onTrigger?.(number, 'inner')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={60}
        outerRadius={75}
        color={doubleColor}
        onTrigger={() => onTrigger?.(number, 'triple')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={75}
        outerRadius={110}
        color={singleColor}
        onTrigger={() => onTrigger?.(number, 'outer')}
      />
      <BoardArcElement
        startAngle={-9}
        innerRadius={110}
        outerRadius={127}
        color={doubleColor}
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
