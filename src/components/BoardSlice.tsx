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
  const ref20 = useRef(null);
  const isHover20 = useHover(ref20);

  const doubleColor = darkSlice
    ? isHover20
      ? 'red'
      : '#79081D'
    : isHover20
    ? 'green'
    : '#17520D';
  const singleColor = darkSlice
    ? isHover20
      ? 'grey'
      : 'black'
    : isHover20
    ? 'lightgrey'
    : 'white';

  return (
    <g ref={ref20}>
      <BoardArcElement
        startAngle={angle - 9}
        innerRadius={20}
        outerRadius={60}
        color={singleColor}
        onTrigger={() => onTrigger?.(number, 'inner')}
      />
      <BoardArcElement
        startAngle={angle - 9}
        innerRadius={60}
        outerRadius={75}
        color={doubleColor}
        onTrigger={() => onTrigger?.(number, 'triple')}
      />
      <BoardArcElement
        startAngle={angle - 9}
        innerRadius={75}
        outerRadius={110}
        color={singleColor}
        onTrigger={() => onTrigger?.(number, 'outer')}
      />
      <BoardArcElement
        startAngle={angle - 9}
        innerRadius={110}
        outerRadius={127}
        color={doubleColor}
        onTrigger={() => onTrigger?.(number, 'double')}
      />
    </g>
  );
};

export default BoardSlice;
