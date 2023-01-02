import { Color, newColor } from '../../utils/colors';
import { SlicePart } from '../../utils/darts';
import BoardCircleElement from './BoardCircleElement';

type BoardBullProps = {
  innerRadius: number;
  outerRadius: number;
  overlayColors?: Partial<Record<SlicePart, Color>>;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const BoardBull = ({
  innerRadius,
  outerRadius,
  overlayColors,
  onTrigger,
}: BoardBullProps) => {
  return (
    <g>
      <BoardCircleElement
        radius={outerRadius}
        color={newColor(23, 82, 13)}
        overlayColor={overlayColors?.outer}
        onTrigger={() => onTrigger?.(25, 'outer')}
      />
      <BoardCircleElement
        radius={innerRadius}
        color={newColor(121, 8, 29)}
        overlayColor={overlayColors?.double}
        onTrigger={() => onTrigger?.(25, 'double')}
      />
    </g>
  );
};

export default BoardBull;
