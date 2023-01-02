import { Color, newColor } from '../../utils/colors';
import { SlicePart } from '../../utils/darts';
import BoardCircleElement from './BoardCircleElement';

type BoardBullProps = {
  innerRadius: number;
  outerRadius: number;
  overlayColors?: Partial<Record<SlicePart, Color>>;
  onActivate?: (number: number, part: SlicePart) => void;
  onDeactivate?: (number: number, part: SlicePart) => void;
  onTrigger?: (number: number, part: SlicePart) => void;
};

const BoardBull = ({
  innerRadius,
  outerRadius,
  overlayColors,
  onActivate,
  onDeactivate,
  onTrigger,
}: BoardBullProps) => {
  return (
    <g>
      <BoardCircleElement
        radius={outerRadius}
        color={newColor(23, 82, 13)}
        overlayColor={overlayColors?.outer}
        onActivate={() => onTrigger?.(25, 'outer')}
        onDeactivate={() => onTrigger?.(25, 'outer')}
        onTrigger={() => onTrigger?.(25, 'outer')}
      />
      <BoardCircleElement
        radius={innerRadius}
        color={newColor(121, 8, 29)}
        overlayColor={overlayColors?.double}
        onActivate={() => onTrigger?.(25, 'double')}
        onDeactivate={() => onTrigger?.(25, 'double')}
        onTrigger={() => onTrigger?.(25, 'double')}
      />
    </g>
  );
};

export default BoardBull;
