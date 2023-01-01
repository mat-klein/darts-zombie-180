import { SlicePart } from '../../utils/darts';
import BoardCircleElement from './BoardCircleElement';

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
  return (
    <g>
      <BoardCircleElement
        radius={outerRadius}
        color={'#17520D'}
        onTrigger={() => onTrigger?.(25, 'outer')}
      />
      <BoardCircleElement
        radius={innerRadius}
        color={'#79081D'}
        onTrigger={() => onTrigger?.(25, 'double')}
      />
    </g>
  );
};

export default BoardBull;
